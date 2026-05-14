import Button from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
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
    const formData = new FormData();
    formData.append("file", {
      uri: image!,
      type: "image/jpeg",
      name: "category.jpg",
    } as any);

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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Category Info</Text>

      <Field
        placeholder="Category name"
        value={name}
        onChangeText={setName}

      />

      <Field
        placeholder="Description"
        value={description}
        onChangeText={setDescription}

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

      <TouchableOpacity onPress={pickImage} style={{ marginVertical: 12 }}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <Button title="Save Category" onPress={updateCategory} />
    </View>
  );
}
