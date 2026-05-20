import { useUser } from "@/components/userContext";
import { colors, fonts, spacing, SearchPageStyle as styles } from "@/theme";
import { RecipeBox, UserRecipeHistory } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../Search";

export default function HistoryRecipe(){
    const{user} = useUser();
   const [recipes, setRecipes] = useState<RecipeBox[]>([]);
   const [loading, setLoading] = useState(true);
   const [history, setHistory] = useState<UserRecipeHistory[]>([]);

   const loadHistory = async () => {
try {
      const response = await fetch(`${API_BASE_URL}api/UserRecipeHistory`,
      {
        headers: {
          "Authorization": user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: UserRecipeHistory[] = await response.json();
      setHistory(res);

      // Fetch recipe details for each recipeId
      const recipePromises = res.map(async (h) => {
        const r = await fetch(`${API_BASE_URL}api/Recipes/recipe/detail/${h.recipeId}`);
        return await r.json();
      });

      const recipeResults = await Promise.all(recipePromises);
      setRecipes(recipeResults);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) return <Text>Loading history...</Text>;

   return (
    <SafeAreaView style={{ flex: 1 }}>
        <View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Image source={require("assets/images/Arrow-Left.png")} />
        </TouchableOpacity>
            <Text style={{fontSize: 30, fontFamily: fonts.semiBold, color: colors.textDark, marginBottom: spacing.sm, textAlign: "center"}}>RECENT RECIPES</Text>
        </View>
        <FlatList 
        data = {recipes}
        keyExtractor={(item) => item.recipeId.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => 
                router.push({
                    pathname:"./[recipeId]/RecipeDetail",
                    params: { recipeId: item.recipeId.toString() },
                })
            }
            >
                <View style = {{marginTop: 16,marginBottom: 16}}>
                    <RecipeCard {...item}/>
                </View>
            </TouchableOpacity>
        )}
        />
    </SafeAreaView>
   );
}