import { colors, fonts, spacing, SearchPageStyle as styles } from "@/theme";
import { RecipeBox, RecipePagination } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../Search";

export default function AllRecipe(){
   const [recipes, setRecipes] = useState<RecipeBox[]>([]);
   const [loading, setLoading] = useState(true);

   const loadRecipes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}api/Recipes/home?page=1&pageSize=60`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const res: RecipePagination = await response.json();
        setRecipes(res.recipeList);
    } catch (err) {
        console.error("Error loading recipes:", err);
    } finally {
        setLoading(false);
    }
   };

   useEffect (()=>{
    loadRecipes();
   }, []);

   if(loading) return <Text>Loading recipes...</Text>;

   return (
    <SafeAreaView style={{ flex: 1 }}>
        <View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Image source={require("assets/images/Arrow-Left.png")} />
        </TouchableOpacity>
            <Text style={{fontSize: 30, fontFamily: fonts.semiBold, color: colors.textDark, marginBottom: spacing.sm, textAlign: "center"}}>ALL RECIPES</Text>
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