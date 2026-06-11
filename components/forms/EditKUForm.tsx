import { RecipeFormStyles as styles } from "@/theme";
import { Category, KitchenUtensilCategoryDto } from "@/types";
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

export default function EditIngredientForm() {
    const {user} = useUser();
  const { kitchenUtensilId } = useLocalSearchParams(); 
  const [name, setName] = useState("");
  const [kUCategory, setKUCategory] = useState<KitchenUtensilCategoryDto[]>([{categoriesId: null}]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available categories
  useEffect(() => {
    fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=30&type=utensil`, {
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

  //Fetch Ingredient Details if editing

  useEffect(() => {
    if(!kitchenUtensilId) return;
    console.log("kitchen Utensil Id:", kitchenUtensilId)
    const fetchKUDetails = async () => {
        try {
            const res = await fetch (`${API_BASE_URL}api/KitchenUtensils/${kitchenUtensilId}`,{
                headers: {Authorization: user?.token ? `Bearer ${user.token}` : ""},
            });
            if(!res.ok) return;
            const data = await res.json();

            setName(data.name || "");
            setKUCategory(data.categories||[]);
            setPictureDirectory(data.pictureDirectory|| "");
        } catch(err){
            console.error("Error fetching ingredient details:", err);
        }
    };
    fetchKUDetails();
  }, [kitchenUtensilId])

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

  const saveKitchenUtensil = async () => {
    const payload = {
      name,
      categoryId: kUCategory.filter(iKU => iKU.categoriesId !== null).map(iKU =>({
        categoryId: iKU.categoriesId
      })),
      pictureDirectory: pictureDirectory || "",
    };

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}api/Ingredients/update-ingredient/${kitchenUtensilId}`,
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
        console.error("Utensil update failed:", response.status, rawError);
        return;
      }

      router.push("./KitchenUtensilsManagement");
    } catch (error) {
      console.error("Error updating utensil:", error);
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
  
      {/* Utensil Name */}
      <Text>Ingredient Name:</Text>
      <Field
        value={name}
        onChangeText={setName}
        placeholder="Enter ingredient name"
      />
  
      {/* Category */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {kUCategory.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.categoriesId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...kUCategory];
              updated[index].categoriesId = val === "" ? null : Number(val);
              setKUCategory(updated);
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

<Button
          title="Add another category"
          onPress={() =>
            setKUCategory([...kUCategory, { categoriesId: null }])
          }
        />
  
      <Button title="Save Kitchen Utensil" onPress={saveKitchenUtensil} />
    </ScrollView>
  );
}
