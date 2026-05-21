import { RecipeFormStyles as styles } from "@/theme";
import { Category, IngredientCategoryDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function AddIngredientForm() {
  const { user } = useUser();
  const { ingredientsId } = useLocalSearchParams(); // utensilId passed in
  const [name, setName] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [ingredientCategory, setIngCategory] = useState<IngredientCategoryDto[]>([{ categoriesId: null }]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available categories
  useEffect(() => {
    fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=30&type=ingredient`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        if (!res.ok) {
          console.error("Failed to load categories:", res.status, raw);
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Categories response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [data];
        setCategories(normalized);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPictureDirectory(uri);
      console.log("Picked image URI:", uri);
  
      try {
        const formData = new FormData();
        formData.append("file", {
          uri, // keep full URI
          name: "ingredient.jpg",
          type: "image/jpeg",
        } as any);
  
        const response = await fetch(
          `${API_BASE_URL}api/Ingredients/update/image/ingredient/${ingredientsId}`,
          {
            method: "PUT",
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
              // ❌ don’t set Content-Type manually
            },
            body: formData,
          }
        );
  
        if (!response.ok) {
          const text = await response.text();
          console.error("Image upload failed:", text);
        } else {
          console.log("✅ Image uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const saveIngredient = async () => {
    const payload = {
      name,                                     
      measurementUnit: "",                      
      categoryId: ingredientCategory.find(iC => iC.categoriesId !== null)?.categoriesId ?? 0,
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
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const rawError = await response.text();
        console.error("Ingredient update failed:", response.status, rawError);
        return;
      }

      router.push("./IngredientsManagement");
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Add Ingredient</Text>

      {/* Utensil Image */}
      <Text style={styles.sectionTitle}>Ingredient Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {pictureDirectory ? (
          <Image source={{ uri: pictureDirectory }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }]}>
            <Text>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Ingredients Name */}
      <Text>Ingredient Name:</Text>
      <Field
        keyboardType="default"
        value={name}
        onChangeText={setName}
        placeholder="Enter ingredient name"
      />

<Text>Measurement Unit:</Text>
      <Field
        keyboardType="default"
        value={measurementUnit}
        onChangeText={setMeasurementUnit}
        placeholder="Enter measurement unit"
      />

      {/* Category */}
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

      <Button title="Save Ingredient" onPress={saveIngredient} />
    </ScrollView>
  );
}


