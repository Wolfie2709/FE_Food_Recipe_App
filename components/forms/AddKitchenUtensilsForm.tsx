import { RecipeFormStyles as styles } from "@/theme";
import { Category, KitchenUtensilCategoryDto } from "@/types";
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
    View
} from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function AddKitchenUtensilForm() {
    const {user} = useUser();
  const { kitchenUtensilId } = useLocalSearchParams(); // utensilId passed in
  const [name, setName] = useState("");
  const [KitchenUtensilCategory, setKUCategory] = useState<KitchenUtensilCategoryDto[]>([{categoriesId: null}]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available categories
  useEffect(() => {
    fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=10&type=utensil`, {
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
      setPictureDirectory(result.assets[0].uri);
    }
  };

  const saveKitchenUtensil = async () => {
    const payload = {
      name,
      categoryId: KitchenUtensilCategory.filter(kUC => kUC.categoriesId !== null).map(kUC =>({
        categoryId: kUC.categoriesId
      })),
      pictureDirectory: pictureDirectory || "",
    };

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}api/KitchenUtensils/update-utensil/${kitchenUtensilId}`,
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

      const isLocalImage =
        pictureDirectory &&
        !pictureDirectory.startsWith("http") &&
        !pictureDirectory.startsWith("/Pictures");

      if (isLocalImage) {
        const formData = new FormData();
        if (Platform.OS === "web") {
          const imageResponse = await fetch(pictureDirectory);
          const blob = await imageResponse.blob();
          const file = new File([blob], `utensil-${kitchenUtensilId || "temp"}-${Date.now()}.jpg`, {
            type: blob.type || "image/jpeg",
          });
          formData.append("file", file);
        } else {
          formData.append("file", {
            uri: pictureDirectory,
            name: `utensil-${kitchenUtensilId || "temp"}-${Date.now()}.jpg`,
            type: "image/jpeg",
          } as any);
        }

        const uploadCandidates = [
          `${API_BASE_URL}api/KitchenUtensils/update/image/kitchen-utensil/${kitchenUtensilId}`,
          `${API_BASE_URL}api/KitchenUtensils/update/image/utensil/${kitchenUtensilId}`,
        ];

        let uploaded = false;
        for (const uploadUrl of uploadCandidates) {
          const imageResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          });

          if (imageResponse.ok) {
            uploaded = true;
            break;
          }
        }

        if (!uploaded) {
          console.error("Utensil image upload failed for all known endpoints");
        }
      }

      router.push("./KitchenUtensilManagement");
    } catch (error) {
      console.error("Error updating utensil:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Update Kitchen Utensil</Text>
  
      {/* Utensil Image */}
      <Text style={styles.sectionTitle}>Utensil Image</Text>
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
      <Text>Utensil Name:</Text>
      <Field
        value={name}
        onChangeText={setName}
        placeholder="Enter utensil name"
      />
  
      {/* Category */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {KitchenUtensilCategory.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.categoriesId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...KitchenUtensilCategory];
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
  
      <Button title="Save Utensil" onPress={saveKitchenUtensil} />
    </ScrollView>
  );
}
