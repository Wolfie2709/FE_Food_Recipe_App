import { RecipeFormStyles as styles } from "@/theme";
import {
    Category,
    CreateRecipeRequestDto,
    Ingredient,
    KitchenUtensil,
    RecipeCategoryInfoDto,
    RecipeIngredient,
    RecipeKitchenUtensilsInfoDto,
} from "@/types";
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
    View,
} from "react-native";
import Button from "../ui/button";
import { MinusIcon } from "../ui/figma_Icons";
import { useUser } from "../userContext";

export default function EditRecipeForm() {
  const { user } = useUser();
  const { recipeId } = useLocalSearchParams(); // recipeId passed from RecipeManagement
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategoryInfoDto[]>([]);
  const [recipeKU, setRecipeKU] = useState<RecipeKitchenUtensilsInfoDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kitchenUtensils, setKitchenUtensils] = useState<KitchenUtensil[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const router = useRouter();

  // Load available ingredients, categories, utensils
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingRes, catRes, kuRes] = await Promise.all([
          fetch(`${API_BASE_URL}api/Ingredients/all`, {
            headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
          }),
          fetch(`${API_BASE_URL}api/Categories/all`, {
            headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
          }),
          fetch(`${API_BASE_URL}api/KitchenUtensils/all`, {
            headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
          }),
        ]);

        const ingData = await ingRes.json();
        const catData = await catRes.json();
        const kuData = await kuRes.json();

        setIngredients(Array.isArray(ingData) ? ingData : [ingData]);
        setCategories(Array.isArray(catData) ? catData : [catData]);
        setKitchenUtensils(Array.isArray(kuData) ? kuData : [kuData]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch recipe details if editing
  useEffect(() => {
    if (!recipeId) return;
    const fetchRecipeDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Recipes/${recipeId}`, {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
        });
        if (!res.ok) return;
        const data = await res.json();

        setName(data.name || "");
        setDescription(data.description || "");
        setServes(data.servingSize?.toString() || "1");
        setCookTime(data.cookingTime?.toString() || "0");
        setRecipeIngredients(data.ingredients || []);
        setRecipeCategories(data.categories || []);
        setRecipeKU(data.kitchenUtensils || []);
        setRecipeImage(data.imageUrl || null);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri);
    }
  };

  const saveRecipe = async () => {
    const payload: CreateRecipeRequestDto = {
      name,
      description: description || null,
      servingSize: parseInt(serves, 10),
      cookingTime: parseInt(cookTime, 10),
      ingredients: recipeIngredients.map((rI) => ({
        ingredientId: rI.ingredientsId!,
        quantity: rI.quantity,
      })),
      categories: recipeCategories.map((rC) => ({
        categoryId: rC.CategoriesId!,
      })),
      kitchenUtensils: recipeKU.map((rKU) => ({
        utensilId: rKU.KitchenUtensilsId!,
      })),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}api/Recipes/update/complete-recipe-info/${recipeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("Recipe update failed:", await response.text());
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
      <Text style={styles.header}>Edit Recipe</Text>

      {/* Recipe Image */}
      <Text style={styles.sectionTitle}>Recipe Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {recipeImage ? (
          <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }]}>
            <Text>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Recipe Name */}
      <Text>Recipe Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter recipe name"
      />

      {/* Description */}
      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter recipe description"
        multiline
      />

      {/* Serves */}
      <Text>Serves:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={serves}
        onChangeText={setServes}
      />

      {/* Cook Time */}
      <Text>Cook Time (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cookTime}
        onChangeText={setCookTime}
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
              <Picker.Item key={ing.ingredientsId} label={ing.name} value={ing.ingredientsId} />
            ))}
          </Picker>

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Quantity"
            value={item.quantity}
            onChangeText={(val) => {
              const updated = [...recipeIngredients];
              updated[index].quantity = val;
              setRecipeIngredients(updated);
            }}
          />

          <TouchableOpacity
            onPress={() => {
              const updated = recipeIngredients.filter((_, i) => i !== index);
              setRecipeIngredients(updated);
            }}
            style={{ marginLeft: 8 }}
          >
            <MinusIcon size={20} color="#E23E3E" />
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add new ingredient" onPress={() => setRecipeIngredients([...recipeIngredients, { ingredientsId: null, quantity: "" }])} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {recipeCategories.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.CategoriesId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeCategories];
              updated[index].CategoriesId = val === "" ? null : Number(val);
              setRecipeCategories(updated);
            }}
          >
            <Picker.Item label="Select category..." value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.categoryId} label={cat.name} value={cat.categoryId} />
            ))}
          </Picker>
        </View>
      ))}
      <Button title="Add new category" onPress={() => setRecipeCategories([...recipeCategories, { CategoriesId: null }])} />

      {/* Kitchen Utensils */}
      <Text style={styles.sectionTitle}>Kitchen Utensils</Text>
      {recipeKU.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.KitchenUtensilsId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeKU];
              updated[index].KitchenUtensilsId = val === "" ? null : Number(val);
              setRecipeKU(updated);
            }}
          >
            <Picker.Item label="Select utensils..." value="" />
            {kitchenUtensils.map((ku) => (
              <Picker.Item key={ku.kitchenUtensilId} label={ku.name} value={ku.kitchenUtensilId} />
            ))}
          </Picker>
        </View>
      ))}
      <Button title="Add new utensil" onPress={() => setRecipeKU([...recipeKU, { KitchenUtensilsId: null }])} />

      {/* Save and go to cooking steps */}
      <Button title="Save & Edit Cooking Steps" onPress={saveRecipe} />
    </ScrollView>
  );
}
