import { useUser } from "@/components/userContext";
import { colors, fonts, spacing, SearchPageStyle as styles } from "@/theme";
import { RecipeBox, WishlistDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../Search";

export default function WishlistPage() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<RecipeBox[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/Wishlists/all`, {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: WishlistDto[] = await response.json();

      // Fetch recipe details for each recipeId
      const recipePromises = res.map(async (w) => {
        const r = await fetch(
          `${API_BASE_URL}api/Recipes/recipe/detail/${w.recipeId}`
        );
        return await r.json();
      });

      const recipeResults = await Promise.all(recipePromises);
      setRecipes(recipeResults);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (recipeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/Wishlists/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
  
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
      // Update local state to remove the recipe
      setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };
  

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) return <Text>Loading wishlist...</Text>;

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
          WISHLISTED RECIPES
        </Text>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipeId.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
            <View style={{ marginTop: 16, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "./[recipeId]/RecipeDetail",
                params: { recipeId: item.recipeId.toString() },
              })
            }
          >
              <RecipeCard {...item} />
          </TouchableOpacity>
          <TouchableOpacity
      style={{
        marginTop: 8,
        padding: 10,
        backgroundColor: "red",
        borderRadius: 6,
        alignItems: "center",
      }}
      onPress={() => removeFromWishlist(item.recipeId)}
    >
      <Text style={{ color: "white", fontFamily: fonts.semiBold }}>
        Remove from Wishlist
      </Text>
    </TouchableOpacity>
            </View>
        )}
      />
    </SafeAreaView>
  );
}
