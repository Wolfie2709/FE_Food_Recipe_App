import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Recipe } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";
import OverlayMenu from "../../../components/ui/overlay-menu";

export default function RecipeManagement() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);

  const loadRecipes = async (): Promise<Recipe[]> => {
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
        return [];
      }
      const data = await res.json();
      setRecipes(data.recipeList);
      return data.recipeList || [];
    } catch (error) {
      console.error("Error loading recipes:", error);
      return [];
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const searchRecipes = async () => {
    try {
      const keyword = searchText.trim();

      if (!keyword) {
        await loadRecipes();
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}api/Recipes/search?recipeName=${encodeURIComponent(keyword)}&page=1&pageSize=999`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to search recipes:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setRecipes(data.recipeList || []);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  const sortRecipesByIdAsc = () => {
    setRecipes((prev) => [...prev].sort((a, b) => a.recipeId - b.recipeId));
  };

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
        }),
      });

      const raw = await res.text();

      if (!res.ok) {
        console.error("Failed to create recipe:", res.status, res.statusText, raw);
        return;
      }

      if (raw.includes("success")) {
        console.log("Recipe created successfully");
        const updated = await loadRecipes();

        if (updated && updated.length > 0) {
          const latest = updated.reduce((max, r) => (r.recipeId > max.recipeId ? r : max), updated[0]);
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
      const res = await fetch(`${API_BASE_URL}api/Recipes/soft/recipe-${recipeId}`, {
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
      const res = await fetch(`${API_BASE_URL}api/Recipes/hard/${recipeId}`, {
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
          {(() => {
            const rawImage = Array.isArray(item.pictureDirectory)
              ? item.pictureDirectory[0]
              : item.pictureDirectory || item.picture_directory || item.imageDirectory || item.imageUrl;
            const normalizedImage = rawImage && !/\.[a-zA-Z0-9]+(?:$|[?#])/.test(rawImage)
              ? `${rawImage}.jpg`
              : rawImage;
            const imageUri = !normalizedImage
              ? null
              : normalizedImage.startsWith("http")
                ? normalizedImage
                : normalizedImage.includes("/")
                  ? `${URL}${normalizedImage.startsWith("/") ? normalizedImage : `/${normalizedImage}`}`
                  : `${URL}/Pictures/Recipes/${item.recipeId}/${normalizedImage}`;

            return (
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("assets/images/icon.png")
            }
            style={styles.ImageContent}
            resizeMode="cover"
          />
            );
          })()}
          <View style={styles.ProductInformation}>
            <Text style={styles.tableCellText}>{item.name || "Untitled"}</Text>
          </View>
        </View>
      </View>

      {/* Three-dot icon */}
      <TouchableOpacity
        style={{ marginRight: -1 }}
        onPress={() =>
          setMenuVisibleId(menuVisibleId === item.recipeId ? null : item.recipeId)
        }
      >
        <Image source={require("assets/images/Union.png")} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe</Text>
      <Text style={styles.title}>Recipe Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchText}
          placeholder="Search recipes..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchRecipes}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={searchRecipes} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Search + Add New Recipe buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={sortRecipesByIdAsc} />
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
          style={{ marginLeft: -6, flex: 1 }}
          keyExtractor={(item) => item.recipeId.toString()}
          renderItem={renderItem}
        />
      </View>

      {/* Overlay menu */}
      <OverlayMenu
        visible={!!menuVisibleId}
        onClose={() => setMenuVisibleId(null)}
        items={
          menuVisibleId
            ? [
                {
                  label: "Edit",
                  onPress: () =>
                    router.push({
                      pathname: "./edit-recipe/EditRecipe",
                      params: { recipeId: menuVisibleId.toString() },
                    }),
                },
                {
                  label: "Edit Recipe Step",
                  onPress: () =>
                    router.push({
                      pathname: "./edit-recipe/EditRecipeStep",
                      params: { recipeId: menuVisibleId.toString() },
                    }),
                },
                {
                  label: "Soft Delete",
                  onPress: () => softDeleteRecipe(menuVisibleId),
                  destructive: true,
                },
                {
                  label: "Hard Delete",
                  onPress: () => hardDeleteRecipe(menuVisibleId),
                  destructive: true,
                },
              ]
            : []
        }
      />
    </View>
  );
}
