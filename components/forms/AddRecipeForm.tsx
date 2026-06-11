import { RecipeFormStyles as styles } from "@/theme";
import { Category, CreateRecipeRequestDto, Ingredient, KitchenUtensil, RecipeCategoryInfoDto, RecipeIngredient, RecipeKitchenUtensilsInfoDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../ui/button";
import CategoryDropdown from "../ui/categoryDropdown";
import { MinusIcon } from "../ui/figma_Icons";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function AddNewRecipeForm() {
  const {user} = useUser();
  const { recipeId } = useLocalSearchParams(); // recipeId passed from RecipeManagement
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredientsId: null, quantity: "" },
  ]);
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategoryInfoDto[]>([
    { categoriesId: null },
  ]);
  const [recipeKU, setRecipeKU] = useState<RecipeKitchenUtensilsInfoDto[]>([
    { kitchenUtensilId: null },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kitchenUtensils, setKitchenUtensils] = useState<KitchenUtensil[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available ingredients
  useEffect(() => {
    console.log("Updating recipe with id:", recipeId);
    fetch(`${API_BASE_URL}api/Ingredients/all`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text(); // read once
        if (!res.ok) {
          console.error("Failed to load ingredients:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Ingredients API returned empty response");
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Ingredients response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        // Normalize: if backend returns a single object, wrap it in an array
        const normalized = Array.isArray(data) ? data : [data];
        setIngredients(normalized);
      })
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=50&type=recipe`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        if (!res.ok) {
          console.error("Failed to load categories:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Categories API returned empty response");
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
        // ✅ Extract categoryList
        const list = data?.categoryList || [];
        const normalized = Array.isArray(list) ? list : [list];
        setCategories(normalized);
      })
      .catch((err) => console.error("Error loading Categories:", err));
  }, []);
  
  useEffect(() => {
    console.log("Updating recipe with id:", recipeId);
    fetch(`${API_BASE_URL}api/KitchenUtensils/all`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text(); // read once
        if (!res.ok) {
          console.error("Failed to load ingredients:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Kitchen Utensils API returned empty response");
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("KitchenUtensils response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        // Normalize: if backend returns a single object, wrap it in an array
        const normalized = Array.isArray(data) ? data : [data];
        setKitchenUtensils(normalized);
      })
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientsId: null, quantity: "" }]);
  };


  const addCategoryRow = () => {
    setRecipeCategories([...recipeCategories, { categoriesId: null }]);
  };

  const addKitchenUtensilsRow = () => {
    setRecipeKU([...recipeKU, { kitchenUtensilId: null }]);
  };

  // 🔹 Pick image and upload immediately
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setRecipeImage(uri); // show preview in UI
      console.log("Picked recipe image URI:", uri);
  
      try {
        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "recipe.jpg",
          type: "image/jpeg",
        } as any);
  
        const response = await fetch(
          `${API_BASE_URL}api/Pictures/add-picture-for-recipe-${recipeId}`,
          {
            method: "POST",
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
              // ❌ don’t set Content-Type manually
            },
            body: formData,
          }
        );
  
        if (!response.ok) {
          const text = await response.text();
          console.error("Recipe image upload failed:", text);
        } else {
          console.log("✅ Recipe image uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading recipe image:", error);
      }
    }
  };
  
  
  // 🔹 Save recipe and go to cooking steps
  const goToCookingSteps = async () => {
    const payload: CreateRecipeRequestDto = {
      name,
      description: description || null,
      servingSize: parseInt(serves, 10),
      cookingTime: parseInt(cookTime, 10),
      ingredients: recipeIngredients
        .filter((rI) => rI.ingredientsId !== null)
        .map((rI) => ({
          ingredientsId: rI.ingredientsId!,
          quantity: rI.quantity,
        })),
      categories: recipeCategories
        .filter((rC) => rC.categoriesId !== null)
        .map((rC) => ({
          categoriesId: rC.categoriesId!,
        })),
      kitchenUtensils: recipeKU
        .filter((rKU) => rKU.kitchenUtensilId !== null)
        .map((rKU) => ({
          kitchenUtensilId: rKU.kitchenUtensilId!,
        })),
    };

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}api/Recipes/update/complete-recipe-info/${recipeId}`,
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
        console.error("Recipe update failed:", response.status, rawError);
        return;
      }

      router.push({
        pathname: "./AddCookingSteps",
        params: { recipeId: recipeId.toString() },
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Create Recipe</Text>

      {/* Recipe Image */}
      <Text style={styles.sectionTitle}>Recipe Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {recipeImage ? (
          <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
        ) : (
          <View style={[
            styles.recipeImage,
            { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }
          ]}>

            <Text>Tap to select an image</Text>
          </View>

        )}
      </TouchableOpacity>

      {/* Recipe Name */}
      <Text>Recipe Name:</Text>
      <Field
        value={name}
        onChangeText={setName}
        placeholder="Enter recipe name"
      />

      {/* Description */}
      <Text>Description:</Text>
      <Field
        value={description}
        onChangeText={setDescription}
        placeholder="Enter recipe description"
        multiline
      />
      {/* Serves */}
      <Text>Serves:</Text>
      <Field
        keyboardType="numeric"
        value={serves}
        onChangeText={setServes}
        placeholder="Enter serving size"
      />

      {/* Cook Time */}
      <Text>Cook Time (minutes):</Text>
      <Field
        keyboardType="numeric"
        value={cookTime}
        onChangeText={setCookTime}
        placeholder="Enter cook time"
      />

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipeIngredients.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.ingredientsId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeIngredients];
              updated[index].ingredientsId = val === "" ? null : Number(val);
              setRecipeIngredients(updated);
            }}
          >
            <Picker.Item label="Select ingredient..." value="" />
            {ingredients.map((ing) => (
              <Picker.Item
                key={ing.ingredientsId}
                label={ing.name}
                value={ing.ingredientsId}
              />
            ))}
          </Picker>

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Quantity (e.g. 250gr)"
            value={item.quantity}
            onChangeText={(val) => {
              const updated = [...recipeIngredients];
              updated[index].quantity = val;
              setRecipeIngredients(updated);
            }}
          />

          {/* Delete row button */}
          <TouchableOpacity
            onPress={() => {
              const updated = recipeIngredients.filter((_, i) => i !== index);
              setRecipeIngredients(updated);
            }}
            style={{ marginLeft: 8 }}
          >
            <MinusIcon size={20} color="#E23E3E" />
          </TouchableOpacity>

          {item.ingredientsId && (
            <Image
              source={{
                uri:
                  ingredients.find((ing) => ing.ingredientsId === item.ingredientsId)
                    ?.pictureDirectory || "",
              }}
              style={{ width: 40, height: 40 }}
            />
          )}
        </View>
      ))}
      <Button title="Add new ingredient" onPress={addIngredientRow} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {recipeCategories.map((item, index) => (
  <CategoryDropdown
    key={index}
    label={`Category ${index + 1}`}
    selectedCategoryId={item.categoriesId}
    onSelect={(val) => {
      const updated = [...recipeCategories];
      updated[index].categoriesId = val;
      setRecipeCategories(updated);
    }}
    type="recipe"
  />
))}
      <Button title="Add new category" onPress={addCategoryRow} />

      {/* Kitchen Utensils */}
      <Text style={styles.sectionTitle}>Kitchen Utensils</Text>
      {recipeKU.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.kitchenUtensilId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeKU];
              updated[index].kitchenUtensilId = val === "" ? null : Number(val);
              setRecipeKU(updated);
            }}
          >
            <Picker.Item label="Select utensils..." value="" />
            {kitchenUtensils.map((ku) => (
              <Picker.Item
                key={ku.kitchenUtensilId}
                label={ku.name}
                value={ku.kitchenUtensilId}
              />
            ))}
          </Picker>

        </View>
      ))}
      <Button title="Add new utensil" onPress={addKitchenUtensilsRow} />

      <Button title="Add cooking steps" onPress={goToCookingSteps} />
    </ScrollView>
  );
}
//