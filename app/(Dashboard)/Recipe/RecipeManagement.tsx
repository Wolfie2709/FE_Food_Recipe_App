import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Recipe } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function RecipeManagement() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null); // ✅ track which row’s menu is open
  const router = useRouter();

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
  

  const softDeleteRecipe = async (recipeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-${recipeId}`, {
        method: "DELETE",
        headers: { "Authorization": user?.token ? `Bearer ${user.token}` : "" },
      });
      if (res.ok) {
        console.log("Soft deleted successfully");
        await loadRecipes();
      } else {
        console.error("Soft delete failed");
      }
    } catch (err) {
      console.error("Error soft deleting recipe:", err);
    }
  };

  const hardDeleteRecipe = async (recipeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Recipes/${recipeId}`, {
        method: "DELETE",
        headers: { "Authorization": user?.token ? `Bearer ${user.token}` : "" },
      });
      if (res.ok) {
        console.log("Hard deleted successfully");
        await loadRecipes();
      } else {
        console.error("Hard delete failed");
      }
    } catch (err) {
      console.error("Error hard deleting recipe:", err);
    }
  };

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.recipeId}</Text>
      </View>

      <View style={styles.tableCellProduct}>
        <View style={styles.ProductCell}>
          <Image
            source={
              item.imageDirectory
                ? { uri: `${URL}${item.imageDirectory}` }
                : require("assets/images/icon.png")
            }
            style={styles.ImageContent}
            resizeMode="cover"
          />
          <View style={styles.ProductInformation}>
            <Text style={styles.tableCellText}>{item.name || "Untitled"}</Text>
          </View>
        </View>
      </View>

      {/* Three-dot icon */}
      <TouchableOpacity
        onPress={() =>
          setMenuVisibleId(menuVisibleId === item.recipeId ? null : item.recipeId)
        }
      >
        <Image source={require("assets/images/Union.png")} />
      </TouchableOpacity>

      {/* Context menu */}
      {menuVisibleId === item.recipeId && (
        <View style={styles.contextMenu}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "./edit-recipe/[recipeId]/EditRecipe",
                params: { recipeId: item.recipeId.toString() },
              })
            }
          >
            <Text style={styles.menuItem}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => softDeleteRecipe(item.recipeId)}>
            <Text style={styles.menuItem}>Soft Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => hardDeleteRecipe(item.recipeId)}>
            <Text style={styles.menuItem}>Hard Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
        <Button title="Filter" onPress={() => {}} />
        <Button title="Add New Recipe" onPress={createRecipe} />
      </View>

      {/* Table */}
      <View style={styles.boxListTable}>
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

        <FlatList
          data={recipes}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.recipeId.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
