import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Recipe } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function RecipeManagement() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  // Load all recipes
  const loadRecipes = async () => {
    try {
      const res = await fetch(
        "http://192.168.1.108:5103/api/Recipes/home?page=1&pageSize=50",
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

      const res = await fetch("http://192.168.1.108:5103/api/Recipes/create-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: "Untitled Recipe",
          cookingTime: 0,
          servingSize: 0,
          category: null,
        }),
      });

      if (!res.ok) {
        const rawError = await res.text();
        console.error("Failed to create recipe:", res.status, res.statusText, rawError);
        return;
      }

      // Some backends return plain text instead of JSON
      const raw = await res.text();
      let newRecipe: any;
      try {
        newRecipe = JSON.parse(raw);
      } catch {
        console.log("Response was not JSON:", raw);
        // Fallback: reload recipes and navigate to the newest one
        await loadRecipes();
        const latest = recipes[recipes.length - 1];
        if (latest?.recipeId) {
          router.push({
            pathname: "/(Dashboard)/Recipe/AddNewRecipe",
            params: { id: latest.recipeId.toString() },
          });
        }
        return;
      }

      if (!newRecipe.recipeId) {
        console.error("API did not return recipeId:", newRecipe);
        return;
      }

      router.push({
        pathname: "/(Dashboard)/Recipe/AddNewRecipe",
        params: { id: newRecipe.recipeId.toString() },
      });

      loadRecipes();
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RECIPES</Text>
      <Text style={styles.subtitle}>Recipe Management</Text>

      {/* Search bar placeholder */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>Search</Text>
      </View>

      {/* Add New Recipe button */}
      <Button title="Add New Recipe" onPress={createRecipe} />

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
                pathname: "/(Dashboard)/Recipe/AddNewRecipe",
                params: { id: item.recipeId.toString() },
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
