import { RecipeDetailStyles as styles } from "@/theme";
import {
  RecipeDetailCompleteDto
} from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeDetailCompleteDto | null>(null);

  type UserPlaceholder = { pictureAvatarDirectory: string, Name?: string }
  const userPlaceholder: UserPlaceholder = {
    pictureAvatarDirectory: "assets/images/icon.png",
    Name: "Placeholder Author",
  }

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`${API_BASE_URL}api/Recipes/recipe/detail/${recipeId}`);
      const data = await res.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, [recipeId]);

  if (!recipe) return <Text>Loading...</Text>;
  console.log("recipe detail: ", recipe);

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  const imageUri = recipe.pictureDirectory?.[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Only ScrollView (and FlatList) supports contentContainerStyle */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require("assets/images/Arrow-Left.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require("assets/images/More.png")} />
          </TouchableOpacity>
        </View>
        {/* Recipe Visual: Pictures, Titles, Rating, Author */}
        <View style={styles.RecipeVisualBlock}>
          <Text style={styles.RecipeName}>{recipe.name}</Text>
          <Image source={imageUri ?
            { uri: `${URL}${imageUri}` }
            : require("assets/images/figma_images/Image1.png")}
            style={styles.RecipePicture} />
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Image source={require("assets/images/Star.png")} />
            <Text style={styles.RecipeRating}>Rating: 4.5 </Text>
          </View>
          <View style={styles.RecipeAuthor}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Haven't return Author info right now so use placeholder instead */}
              <Image source={require("assets/images/icon.png")} style={styles.RecipeAuthorAvatar} />
              <Text style={styles.RecipeAuthorName}>{userPlaceholder.Name}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.RecipeDetailPageButton}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Info Bar: Serving Size, Cooking time */}
        <View style={styles.InfoBar}>
          <View style={[styles.InfoCard, { marginRight: 16 }]}>
            <Text style={styles.InfoLabel}>Serves </Text>
            <Text style={styles.InfoDetail}>{recipe.servingSize}</Text>
          </View>
          <View style={styles.InfoCard}>
            <Text style={styles.InfoLabel}>Cook Time </Text>
            <Text style={styles.InfoDetail}>{recipe.cookingTime} mins</Text>
          </View>
        </View>
        {/* Description */}
        <View style={styles.DescriptionCard}>
          <Text style={styles.DescriptionLabel}>DESCRIPTION</Text>
          <Text style={styles.DescriptionContent}>{recipe.description}</Text>
        </View>
        {/* INGREDIENT LIST */}
        <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600" }}>Ingredients</Text>
        {recipe.ingredients && recipe.ingredients.map((ing) => (
          <View key={ing.id} style={styles.CardList}>
            <View style={styles.CardListItem}>
              <Image source={require("assets/images/icon.png")} style={styles.CardListItemImage} />
              <Text style={styles.CardListItemName}>{ing.name}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#3c3c3c" }}>{ing.quantity} {ing.measurementUnit || "g"}</Text>
          </View>
        ))}
        {/* UTENSIL LIST */}
        <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600" }}>Kitchen Utensils</Text>
        {recipe.kitchenUtensils && recipe.kitchenUtensils.map((ku) => (
          <View key={ku.kitchenUtensilId} style={styles.CardList}>
            <View style={styles.CardListItem}>
              <Image source={require("assets/images/icon.png")} style={styles.CardListItemImage} />
              <Text style={styles.CardListItemName}>{ku.name}</Text>
            </View>
          </View>
        ))}
        {/* <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>Steps</Text> */}
        {/* UTENSIL */}
        <TouchableOpacity>
          <Text style={[styles.RecipeDetailPageButton, styles.StepButton]}>LET'S GET COOKING</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// {
//   recipe.recipeSteps && recipe.recipeSteps.map((step) => (
//     <View key={step.recipeStepId} style={{ marginVertical: 8 }}>
//       <Text style={{ fontWeight: "500" }}>{step.name}</Text>
//       <Text>{step.description}</Text>
//       {/* {step.imageUrl && <Image source={{ uri: step.imageUrl }} style={{ width: 100, height: 100, marginTop: 4 }} />} */}
//     </View>
//   ))
// }
