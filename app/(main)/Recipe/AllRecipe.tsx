import { colors, fonts, spacing, SearchPageStyle as styles } from "@/theme";
import { RecipeBox, RecipePagination } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../Search";

export default function AllRecipe() {
  const [recipes, setRecipes] = useState<RecipeBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ categoriesId: number; name: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const loadRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/Recipes/home?page=1&pageSize=60`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: RecipePagination = await response.json();
      setRecipes(res.recipeList);
    } catch (err) {
      console.error("Error loading recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=50&type=recipe`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res = await response.json();

      // Normalize: only keep categories with a valid numeric ID
      const validCategories = (res.categoryList || [])
        .filter((c: any) => typeof c.categoryId === "number")
        .map((c: any) => ({
          categoriesId: c.categoryId,
          name: c.name || "Unnamed",
        }));

      setCategories(validCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadRecipes();
    loadCategories();
  }, []);

  const filteredRecipes = activeCategory
    ? recipes.filter((r) =>
        r.categories?.some((c) => c.categoriesId === activeCategory)
      )
    : recipes;

  if (loading) return <Text>Loading recipes...</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Image source={require("assets/images/Arrow-Left.png")} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 30,
            fontFamily: fonts.semiBold,
            color: colors.textDark,
            marginBottom: spacing.sm,
            textAlign: "center",
          }}
        >
          ALL RECIPES
        </Text>
      </View>

      {/* Category Picker */}
      <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
        <Picker
          selectedValue={activeCategory}
          onValueChange={(value) => setActiveCategory(value)}
        >
          <Picker.Item label="All Categories" value={null} />
          {categories.map((c) => (
            <Picker.Item
              key={c.categoriesId}
              label={c.name}
              value={c.categoriesId}
            />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.recipeId.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "./[recipeId]/RecipeDetail",
                params: { recipeId: item.recipeId.toString() },
              })
            }
          >
            <View style={{ marginTop: 16, marginBottom: 16 }}>
              <RecipeCard {...item} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
