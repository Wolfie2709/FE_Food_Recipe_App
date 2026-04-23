import { useUser } from "@/components/userContext";
import { RecipeFormStyles as styles } from "@/theme";
import { Category, CreateRecipeRequestDto, Ingredient, KitchenUtensil, RecipeIngredient } from "@/types";
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
  View,
} from "react-native";
import Button from "../ui/button";

export default function AddNewRecipeForm() {
  const { user } = useUser();
  const { recipeId } = useLocalSearchParams(); // recipeId passed from RecipeManagement
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredientId: null, quantity: "" },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kitchenUtensils, setKitchenUtensils] = useState<KitchenUtensil[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const router = useRouter();

  // Load available ingredients
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Ingredients/all`)
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  console.log("Updating recipe with id:", recipeId);

  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: null, quantity: "" }]);
  };

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

  const goToCookingSteps = async () => {
    const payload: CreateRecipeRequestDto = {
      name: "My Recipe",
      description: null,
      servingSize: parseInt(serves, 10),
      cookingTime: parseInt(cookTime, 10),
      ingredients: recipeIngredients
        .filter(rI => rI.ingredientId !== null)
        .map(rI => ({
          ingredientId: rI.ingredientId!,
          quantity: rI.quantity
        })),
      categories: categories.map(c => ({ categoryId: c.id })),
      kitchenUtensils: kitchenUtensils.map(u => ({ utensilId: u.id })),
      // imageUrl: recipeImage, // only include if backend supports it
    };

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/Recipes/update-recipe/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const rawError = await response.text();
        console.error("Recipe update failed:", response.status, rawError);
        return;
      }

      // Navigate using the same id we received
      router.push({
        pathname: "./AddCookingSteps",
        params: { id: recipeId.toString() },
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
      {recipeImage ? (
        <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
      ) : (
        <Text>No image selected</Text>
      )}
      <Button title="Pick an Image" onPress={pickImage} />

      {/* Serves */}
      <Text>Serves:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={serves}
        onChangeText={setServes}
        placeholder="Enter serving size"
      />

      {/* Cook Time */}
      <Text>Cook Time (minutes):</Text>
      <TextInput
        style={styles.input}
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
            selectedValue={item.ingredientId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeIngredients];
              updated[index].ingredientId = val === "" ? null : Number(val);
              setRecipeIngredients(updated);
            }}
          >
            <Picker.Item label="Select ingredient..." value="" />
            {ingredients.map((ing) => (
              <Picker.Item
                key={ing.id}
                label={ing.name}
                value={ing.id}
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

          {item.ingredientId && (
            <Image
              source={{
                uri:
                  ingredients.find((ing) => ing.id === item.ingredientId)
                    ?.imageUrl || "",
              }}
              style={{ width: 40, height: 40 }}
            />
          )}
        </View>
      ))}
      <Button title="Add new ingredient" onPress={addIngredientRow} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {/* Replace with a proper multi-select UI later */}
      <TextInput
        style={styles.input}
        placeholder="Category IDs (comma separated)"
        value={categories.map(c => c.id).join(", ")}
        onChangeText={(val) =>
          setCategories(val.split(",").map(id => ({ id: Number(id.trim()), name: "" })))
        }
      />

      {/* Kitchen Utensils */}
      <Text style={styles.sectionTitle}>Kitchen Utensils</Text>
      <TextInput
        style={styles.input}
        placeholder="Utensil IDs (comma separated)"
        value={kitchenUtensils.map(u => u.id).join(", ")}
        onChangeText={(val) =>
          setKitchenUtensils(val.split(",").map(id => ({ id: Number(id.trim()), name: "", imageUrl: "" })))
        }
      />

      <Button title="Add cooking steps" onPress={goToCookingSteps} />
    </ScrollView>
  );
}
//