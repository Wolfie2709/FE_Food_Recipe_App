import Button from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { RecipeFormStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Field from "../ui/figma_input_fields";

export default function AddCategoryForm() {
  const { user } = useUser();
  const { categoryId } = useLocalSearchParams(); // passed from CategoryManagement when creating empty
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientCategory, setIngredientCategory] = useState(false);
  const [kitchenCategory, setKitchenCategory] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Update category info
  const updateCategory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Categories/update-category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          ingredientCategory,
          kitchenCategory,
          pictureDirectory: null, // handled separately
        }),
      });

      const raw = await res.text();
      if (!res.ok) {
        console.error("Failed to update category:", res.status, raw);
        return;
      }
      console.log("Category updated:", raw);

      if (image) {
        await uploadImage();
      }

      router.back(); // return to management page
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!image) return;
    const formData = new FormData();
    if (Platform.OS === "web") {
      const imageResponse = await fetch(image);
      const blob = await imageResponse.blob();
      const file = new File([blob], `category-${categoryId || "temp"}-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      formData.append("file", file);
    } else {
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: `category-${categoryId || "temp"}-${Date.now()}.jpg`,
      } as any);
    }

    const res = await fetch(`${API_BASE_URL}api/Categories/update/image/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${user?.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.error("Failed to upload image:", await res.text());
    } else {
      console.log("Image uploaded successfully");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.header}>Add Category Info</Text>

      {/* Category Image */}
      <Text style={styles.sectionTitle}>Category Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <View
            style={[
              styles.recipeImage,
              { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
            ]}
          >
            <Text>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Category Name */}
      <Text style={styles.sectionTitle}>Category Name</Text>
      <Field
        keyboardType="default"
        value={name}
        onChangeText={setName}
        placeholder="Enter category name"
      />

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Field
        keyboardType="default"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      {/* Category Type */}
      <Text style={styles.sectionTitle}>Category Type</Text>
      <TouchableOpacity
        onPress={() => {
          setIngredientCategory(true);
          setKitchenCategory(false);
        }}
      >
        <Text>{ingredientCategory ? "Ingredient ✅" : "Ingredient ❌"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIngredientCategory(false);
          setKitchenCategory(true);
        }}
      >
        <Text>{kitchenCategory ? "Kitchen ✅" : "Kitchen ❌"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIngredientCategory(false);
          setKitchenCategory(false);
        }}
      >
        <Text>{!ingredientCategory && !kitchenCategory ? "Recipe ✅" : "Recipe ❌"}</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <Button title="Save Category" onPress={updateCategory} />
    </ScrollView>
  );
}
