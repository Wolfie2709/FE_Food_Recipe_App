import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchPageStyle as styles } from "../../theme";
import { CategoryBoxDto, CategoryPagination, RecipeBox, RecipePagination } from "../../types";

const screenWidth = Dimensions.get("window").width;
const spacing = 10;
const itemWidth = screenWidth / 3 - spacing;

function RecipeCard({ name, authorName, rating, imageDirectory, avatar }: RecipeBox) {
  let URL = API_BASE_URL.slice(0, -1);
  return (
    <View style={styles.recipeCardStyle}>
      <Image
        source={imageDirectory ? { uri: `${URL}${imageDirectory}` } : require("assets/images/figma_images/Image1.png")}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{name}</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={avatar ? { uri: `${URL}${avatar}` } : require("assets/images/icon.png")}
            style={styles.RecipeAuthorAvatar} />
          <Text style={styles.recipeAuthor}>{authorName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.recipeTime}>
            {rating ? rating : 0}
          </Text>
          <Image source={require("assets/images/Star.png")} />
        </View>
      </View>
    </View>
  );
}

export default function Search() {
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // Search keyword
  const [keyword, setKeyword] = useState("");

  // Category list
  const [categories, setCategories] = useState<CategoryBoxDto[]>([]);

  // Search results
  const [recipe, setRecipe] = useState<RecipeBox[]>([]);

  // TextInput reference
  const inputRef = useRef<TextInput>(null);

  // 1. Add state to store the selected category ID
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Call API to get all categories
  const GetCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}api/Categories/category/pagination?type=recipe`
      );

      const res: CategoryPagination = await response.json();
      setCategories(res.categoryList);
      // console.log("Categories:", res);
    } catch (err) {
      console.log("Search error:", err);
      Alert.alert("Error", "Could not connect to server");
    }
  }

  // Call API to search recipes
  const search = async (recipeName: string | null, categoryId: number | null) => {
    try {

      let url = `${API_BASE_URL}api/Recipes/search?`
      if (recipeName !== null) {
        url += `recipeName=${recipeName}`
      }
      if (categoryId !== null) {
        url += `&category=${categoryId}`;
      }
      const response = await fetch(url);

      const res: RecipePagination = await response.json();

      // Save results to state
      setRecipe(res.recipeList);

      // Print results to console for testing
      console.log("Search keyword:", recipeName);
      // console.log("API response:", res);
      // console.log("Recipe list:", res.recipeList);
    } catch (err) {
      console.log("Search error:", err);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  // Clear results when page opens
  useEffect(() => {
    setRecipe([]);
    GetCategories();
  }, []);

  // Print state whenever recipe changes
  useEffect(() => {
    // console.log("Updated recipe state:", recipe);
  }, [recipe]);

  // console.log(categories);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
          onSubmitEditing={() => search(keyword, selectedCategoryId)} // Press Enter/Search to call API
        />
        {/* More Button */}
        <TouchableOpacity style={styles.headerButton}>
          <Image source={require("assets/images/More.png")} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: CategoryBoxDto) => item.categoryId.toString()}
          snapToInterval={itemWidth + spacing}
          decelerationRate="fast"
          renderItem={({ item }) => {
            // Check if this category is currently selected
            const isSelected = selectedCategoryId === item.categoryId;
            return (
              <TouchableOpacity
                onPress={() => {
                  // Optional toggle behavior:
                  // if user taps the selected category again, deselect it
                  const newCategoryId =
                    isSelected ? null : item.categoryId;

                  setSelectedCategoryId(newCategoryId);
                  search(keyword, selectedCategoryId);
                }}
              >
                <View>
                  <Text
                    style={[
                      styles.categoryList,          // default style
                      isSelected && styles.categoryListActive, // active style
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />

        {/* SEARCH CONTENT */}
        <View style={{ marginTop: 16 }}>
          {recipe.length > 0 ? recipe.map(r => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(main)/Recipe/[recipeId]/RecipeDetail",
                  params: { recipeId: r.recipeId.toString() },
                })
              }}
            >
              <View key={r.recipeId}>
                <RecipeCard {...r} />
              </View>
            </TouchableOpacity>
          )) :
            <View><Text>Khong tim thay ket qua</Text></View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}