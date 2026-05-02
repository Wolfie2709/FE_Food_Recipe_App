import { ManagementStyles as styles } from "@/theme";
import type { Recipe, UserWithToken } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function RecipeManagement() {
  const [user, setUserState] = useState<UserWithToken | null>(null);
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
          kitchenUtensils: []
        }),
      });
  
      const raw = await res.text();
  
      if (!res.ok) {
        console.error("Failed to create recipe:", res.status, res.statusText, raw);
        return;
      }
  
      // Backend only returns plain text, so treat this as success
      if (raw.includes("success")) {
        console.log("Recipe created successfully");
  
        // Reload recipes
        await loadRecipes();
  
        // Navigate to the newest recipe (assuming API returns newest first)
        if (recipes.length > 0) {
          const latest = recipes.reduce((max, r) => r.recipeId > max.recipeId ? r: max, recipes[0]);
          router.push({
            pathname: "./add-recipe/AddNewRecipe",
            params: { recipeId: latest.recipeId.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };
  

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() =>
        router.push({
          pathname: "/Recipe/add-recipe/AddNewRecipe",
          params: { recipeId: item.recipeId.toString() },
        })
      }
    >
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.recipeId}</Text>
      </View>

      <View style={styles.tableCellProduct}>
        <View style={styles.ProductCell}>
          <View>
            <Image
              source={
                item.imageDirectory
                  ? { uri: `${URL}${item.imageDirectory}` }
                  : require("assets/images/icon.png")
              }
              style={styles.ImageContent}
              resizeMode="cover"
            />
          </View>

          <View style={styles.ProductInformation}>
            <Text style={styles.tableCellText}>
              {item.name || "Untitled"}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Image source={require("assets/images/Union.png")} />
      </View>
    </TouchableOpacity>
  );

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe</Text>
      <Text style={styles.title}>Recipe Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchText} placeholder="Search recipes..." />
        <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
      </View>

      {/* Filter + Add New Recipe buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={() => { }} />
        <Button title="Add New Recipe" onPress={createRecipe} />
      </View>

      {/* Table */}
      <View style={styles.boxListTable}>
        {/* Table header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderTextId}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>ID</Text>
            </View>
          </View>
          <View style={styles.tableHeaderTextProducts}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>Products</Text>
            </View>
          </View>
        </View>

        {/* Recipe list */}
        <FlatList
          data={recipes}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.recipeId.toString()}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

