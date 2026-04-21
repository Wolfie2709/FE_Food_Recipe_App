import { RecipeFormStyles as styles } from "@/theme";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  View
} from "react-native";
import Button from "../ui/button";

type Ingredient = {
  ingredientId: number;
  name: string;
  imageUrl: string;
};

type RecipeIngredient = {
  ingredientId: number | null;
  quantity: string;
};

export default function AddNewRecipeForm() {
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredientId: null, quantity: "" },
  ]);
  const [category, setCategory] = useState("");
  const [utensils, setUtensils] = useState<string[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);

  // Load available ingredients
  useEffect(() => {
    fetch("http://192.168.1.108:5103/api/Ingredients/all")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

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

  const submitRecipe = async () => {
    const payload = {
      name: "My Recipe",
      serves: parseInt(serves, 10),
      cookTime: parseInt(cookTime, 10),
      ingredients: recipeIngredients,
      category,
      utensils,
      imageUrl: recipeImage,
    };

    try {
      const response = await fetch("http://192.168.1.108:5103/api/Recipes/create-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Recipe created:", result);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <View>
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
        style={styles.input}   // force visible text color
        keyboardType="numeric"
        value={serves}                              // must be a string
        onChangeText={(val) => setServes(val)}      // don’t parse here
      />

      {/* Cook Time */}
      <Text>Cook Time (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cookTime}
        onChangeText={(val) => setServes(val)}
      />

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <FlatList
        data={recipeIngredients}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientRow}>
            {/* Ingredient dropdown */}
            <Picker
              selectedValue={item.ingredientId ?? ""}
              style={styles.input}
              onValueChange={(val) => {
                const updated = [...recipeIngredients];
                // Convert to number if not empty string
                updated[index].ingredientId = val === "" ? null : Number(val);
                setRecipeIngredients(updated);
              }}
            >
              <Picker.Item label="Select ingredient..." value="" />
              {ingredients.map((ing) => (
                <Picker.Item
                  key={ing.ingredientId}
                  label={ing.name}
                  value={ing.ingredientId} // always a number
                />
              ))}
            </Picker>

            {/* Quantity input */}
            <TextInput
              style={styles.input}
              placeholder="Quantity (e.g. 250gr)"
              value={item.quantity}
              onChangeText={(val) => {
                const updated = [...recipeIngredients];
                updated[index].quantity = val;
                setRecipeIngredients(updated);
              }}
            />

            {/* Ingredient image preview */}
            {item.ingredientId && (
              <Image
                source={{
                  uri:
                    ingredients.find((ing) => ing.ingredientId === item.ingredientId)
                      ?.imageUrl || "",
                }}
                style={{ width: 40, height: 40 }}
              />
            )}
          </View>
        )}
      />
      <Button title="Add new ingredient" onPress={addIngredientRow} />

      {/* Category */}
      <Text style={styles.sectionTitle}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Utensils */}
      <Text style={styles.sectionTitle}>Kitchen Utensils</Text>
      <TextInput
        style={styles.input}
        placeholder="Utensils (comma separated)"
        value={utensils.join(", ")}
        onChangeText={(val) => setUtensils(val.split(","))}
      />

      <Button title="Add cooking steps" onPress={submitRecipe} />
    </View>
  );
}

