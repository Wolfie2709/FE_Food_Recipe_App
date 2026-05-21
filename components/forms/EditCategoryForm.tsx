import { RecipeFormStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function EditCategoryForm() {
  const { user } = useUser();
  const { categoryId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();
  const [kitchenCategory, setKitchenCategory] = useState(false);
const [ingredientCategory, setIngredientCategory] = useState(false);

  // Fetch category details if editing
  useEffect(() => {
    if (!categoryId) return;
    const fetchCategoryDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Categories/${categoryId}`, {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
        });
        if (!res.ok) return;
        const data = await res.json();

        setName(data.name || "");
        setPictureDirectory(data.pictureDirectory || "");
      } catch (err) {
        console.error("Error fetching category details:", err);
      }
    };
    fetchCategoryDetails();
  }, [categoryId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPictureDirectory(result.assets[0].uri);
    }
  };

  const saveCategory = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      // Update category info
      const infoResponse = await fetch(
        `${API_BASE_URL}api/Categories/update-category/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!infoResponse.ok) {
        const rawError = await infoResponse.text();
        console.error("Category update failed:", infoResponse.status, rawError);
        return;
      }

      // Update category image if changed
      if (pictureDirectory) {
        const formData = new FormData();
        formData.append("file", {
          uri: pictureDirectory,
          type: "image/jpeg",
          name: "category.jpg",
        } as any);

        const imageResponse = await fetch(
          `${API_BASE_URL}api/Categories/update/image/category/${categoryId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          const rawError = await imageResponse.text();
          console.error("Category image update failed:", imageResponse.status, rawError);
        }
      }

      router.push("./CategoriesManagement");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Edit Category</Text>

      {/* Category Image */}
      <Text style={styles.sectionTitle}>Category Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {pictureDirectory ? (
          <Image source={{ uri: pictureDirectory }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }]}>
            <Text>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Category Name */}
      <Text>Category Name:</Text>
      <Field
        value={name}
        onChangeText={setName}
        placeholder="Enter category name"
      />


<Text style={{ marginVertical: 8 }}>Category Type:</Text>
      <TouchableOpacity onPress={() => { setIngredientCategory(true); setKitchenCategory(false); }}>
        <Text>{ingredientCategory ? "Ingredient ✅" : "Ingredient ❌"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setIngredientCategory(false); setKitchenCategory(true); }}>
        <Text>{kitchenCategory ? "Kitchen ✅" : "Kitchen ❌"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setIngredientCategory(false); setKitchenCategory(false); }}>
        <Text>{(!ingredientCategory && !kitchenCategory) ? "Recipe ✅" : "Recipe ❌"}</Text>
      </TouchableOpacity>


      <Button title="Save Category" onPress={saveCategory} />
    </ScrollView>
  );
}
