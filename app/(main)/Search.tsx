import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchPageStyle as styles } from "../../theme";
import { RecipeBox, RecipePagination } from "../../types";

const screenWidth = Dimensions.get("window").width;
const spacing = 10;
const itemWidth = screenWidth / 3 - spacing;

function RecipeCard({ name, addedBy, rating, imageDirectory }: RecipeBox) {
  let URL = API_BASE_URL.slice(0, -1);
  return (
    <View style={styles.recipeCardStyle}>
      <Image
        source={imageDirectory ? { uri: `${URL}${imageDirectory}` } : require("assets/images/figma_images/Image1.png")}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{name}</Text>
      <Text style={styles.recipeAuthor}>By {addedBy}</Text>
      {rating && <Text style={styles.recipeTime}>star: {rating}</Text>}
    </View>
  );
}

export default function Search() {
  // Search keyword
  const [keyword, setKeyword] = useState("");

  // Search results
  const [recipe, setRecipe] = useState<RecipeBox[]>([]);

  // TextInput reference
  const inputRef = useRef<TextInput>(null);

  // Call API to search recipes
  const search = async (recipeName: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}api/Recipes/search?recipeName=${recipeName}`
      );

      const res: RecipePagination = await response.json();

      // Save results to state
      setRecipe(res.recipeList);

      // Print results to console for testing
      console.log("Search keyword:", recipeName);
      console.log("API response:", res);
      console.log("Recipe list:", res.recipeList);
    } catch (err) {
      console.log("Search error:", err);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  // Clear results when page opens
  useEffect(() => {
    setRecipe([]);
  }, []);

  // Print state whenever recipe changes
  useEffect(() => {
    console.log("Updated recipe state:", recipe);
  }, [recipe]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Image source={require("assets/images/Arrow-Left.png")} />
          </TouchableOpacity>

          {/* Search Input */}
          <TextInput
            ref={inputRef}
            style={styles.SearchBar}
            placeholder="Search recipes"
            value={keyword}
            onChangeText={setKeyword}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
            onSubmitEditing={() => search(keyword)} // Press Enter/Search to call API
          />

          {/* More Button */}
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require("assets/images/More.png")} />
          </TouchableOpacity>
        </View>

        {/* SEARCH CONTENT */}
        <View>
          {recipe.length > 0 ? recipe.map(r => (
            <View key={r.recipeId}>
              <RecipeCard {...r} />
            </View>
          )) :
            <View><Text>Khong tim thay ket qua</Text></View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}