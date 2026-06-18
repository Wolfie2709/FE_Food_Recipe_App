import { RecipeFormStyles as styles } from "@/theme";
import { Category, IngredientCategoryDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function EditIngredientForm() {
  const { user } = useUser();
  const { ingredientsId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [ingredientCategory, setIngCategory] = useState<IngredientCategoryDto[]>([{ categoriesId: null }]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=30&type=ingredient`,
          {
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
  
        // ✅ Fix: use categoryList from the response
        setCategories(Array.isArray(data.categoryList) ? data.categoryList : []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);
  

  // Fetch ingredient details if editing
  useEffect(() => {
    if (!ingredientsId) return;
    const fetchIngDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Ingredients/${ingredientsId}`, {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
        });
        if (!res.ok) return;
        const data = await res.json();

        setName(data.name || "");
        setIngCategory(data.categories?.length ? data.categories : [{ categoriesId: null }]);
        setPictureDirectory(data.pictureDirectory || "");
      } catch (err) {
        console.error("Error fetching ingredient details:", err);
      }
    };
    fetchIngDetails();
  }, [ingredientsId]);

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

  const saveIngredient = async () => {
    const payload = {
      name,
      categoryId: ingredientCategory
        .filter((iC) => iC.categoriesId !== null)
        .map((iC) => ({ categoryId: iC.categoriesId })),
      pictureDirectory: pictureDirectory || "",
    };

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}api/Ingredients/update-ingredient/${ingredientsId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const rawError = await response.text();
        console.error("Ingredient update failed:", response.status, rawError);
        return;
      }

      const isLocalImage =
        pictureDirectory &&
        !pictureDirectory.startsWith("http") &&
        !pictureDirectory.startsWith("/Pictures");

      if (isLocalImage) {
        const formData = new FormData();
        if (Platform.OS === "web") {
          const imageResponse = await fetch(pictureDirectory);
          const blob = await imageResponse.blob();
          const file = new File([blob], `ingredient-${ingredientsId || "temp"}-${Date.now()}.jpg`, {
            type: blob.type || "image/jpeg",
          });
          formData.append("file", file);
        } else {
          formData.append("file", {
            uri: pictureDirectory,
            name: `ingredient-${ingredientsId || "temp"}-${Date.now()}.jpg`,
            type: "image/jpeg",
          } as any);
        }

        const imageResponse = await fetch(
          `${API_BASE_URL}api/Ingredients/update/image/ingredient/${ingredientsId}`,
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
          console.error("Ingredient image update failed:", imageResponse.status, rawError);
        }
      }

      router.push("./IngredientsManagement");
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        <Text style={styles.header}>Edit Ingredient</Text>

        {/* Ingredient Image */}
        <Text style={styles.sectionTitle}>Ingredient Image</Text>
        <TouchableOpacity onPress={pickImage}>
          {pictureDirectory ? (
            <Image source={{ uri: pictureDirectory }} style={styles.recipeImage} />
          ) : (
            <View
              style={[
                styles.recipeImage,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#eee",
                },
              ]}
            >
              <Text>Tap to select an image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Ingredient Name */}
        <Text>Ingredient Name:</Text>
        <Field
          value={name}
          onChangeText={setName}
          placeholder="Enter ingredient name"
        />

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        {ingredientCategory.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Picker
              selectedValue={item.categoriesId ?? ""}
              style={{ flex: 1 }}
              onValueChange={(val) => {
                const updated = [...ingredientCategory];
                updated[index].categoriesId = val === "" ? null : Number(val);
                setIngCategory(updated);
              }}
            >
              <Picker.Item label="Select category..." value="" />
              {categories.map((cat) => (
                <Picker.Item
                  key={cat.categoryId}
                  label={cat.name}
                  value={cat.categoryId}
                />
              ))}
            </Picker>
          </View>
        ))}

        {/* Add another category row */}
        <Button
          title="Add another category"
          onPress={() =>
            setIngCategory([...ingredientCategory, { categoriesId: null }])
          }
        />

        {/* Save button */}
        <Button
          title="Save Ingredient"
          onPress={saveIngredient}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
