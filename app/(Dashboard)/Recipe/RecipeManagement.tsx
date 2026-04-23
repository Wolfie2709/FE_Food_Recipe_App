import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Recipe } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function RecipeManagement() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  // Load all recipes
  const loadRecipes = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/Recipes/home?page=1&pageSize=50`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to load recipes:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setRecipes(data.recipeList);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // Create new recipe and navigate to AddNewRecipe
  const createRecipe = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }
  
      const res = await fetch(`${API_BASE_URL}api/Recipes/create-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: "Untitled Recipe",
          description: null,
          cookingTime: 0,
          servingSize: 0,
          categories: [],
          ingredients: [],
          kitchenUtensils:[]
        }),
      });
  
      if (!res.ok) {
        const rawError = await res.text();
        console.error("Failed to create recipe:", res.status, res.statusText, rawError);
        return;
      }
  
      const newRecipe : Recipe = await res.json();
      console.log("New recipe created with ID:", newRecipe.recipeId); // ✅ log the ID
  
      router.push({
        pathname: "./add-recipe/AddNewRecipe",
        params: { recipeId: newRecipe.recipeId.toString() },
      });
  
      loadRecipes();
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchText} placeholder="Search recipes..." />
      </View>

      {/* Filter + Add New Recipe buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={() => {}} />
        <Button title="Add New Recipe" onPress={createRecipe} />
      </View>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>ID</Text>
        <Text style={styles.tableHeaderText}>Products</Text>
      </View>

      {/* Recipe list */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipeId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tableRow}
            onPress={() =>
              router.push({
                pathname: "./Recipe/AddNewRecipe",
                params: { recipeId: item.recipeId.toString() }, // ✅ consistent param
              })
            }
          >
            <Text style={styles.tableCell}>{item.recipeId}</Text>
            <Text style={styles.tableCell}>{item.name || "Untitled"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
