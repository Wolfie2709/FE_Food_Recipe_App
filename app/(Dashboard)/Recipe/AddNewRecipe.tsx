import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Ingredient = {
  ingredientId: number;
  name: string;
  imageUrl: string;
};

type RecipeIngredient = {
  ingredientId: number | null;
  quantity: string;
};

export default function AddCookingRecipe() {
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredientId: null, quantity: "" },
  ]);
  const [category, setCategory] = useState("");
  const [utensils, setUtensils] = useState<string[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);

  // Load available ingredients from API
  useEffect(() => {
    fetch("http://192.168.1.108:5103/api/Ingredients/all")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  // Add new ingredient row
  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: null, quantity: "" }]);
  };

  // Pick image from gallery
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

  // Submit recipe
  const submitRecipe = async () => {
    const payload = {
      name: "My Recipe",
      serves: parseInt(serves),
      cookTime: parseInt(cookTime),
      ingredients: recipeIngredients,
      category,
      utensils,
      imageUrl: recipeImage, // include image URL
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
    <View style={styles.container}>
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
<FlatList
  data={recipeIngredients}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View style={styles.ingredientRow}>
      {/* Ingredient ID input */}
      <TextInput
        style={styles.input}
        placeholder="Ingredient ID"
        value={item.ingredientId?.toString() ?? ""}
        onChangeText={(val) => {
          const updated = [...recipeIngredients];
          updated[index].ingredientId = parseInt(val);
          setRecipeIngredients(updated);
        }}
      />

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

      {/* Ingredient image */}
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

      <Button title="Submit Recipe" onPress={submitRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  ingredientRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  recipeImage: { width: 200, height: 200, marginVertical: 10, borderRadius: 8 },
});
