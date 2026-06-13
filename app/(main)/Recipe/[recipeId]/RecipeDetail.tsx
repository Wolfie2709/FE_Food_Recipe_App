import Button from "@/components/ui/button";
import { ReviewCard } from "@/components/ui/reviewcard";
import { useUser } from "@/components/userContext";
import { RecipeDetailStyles as styles } from "@/theme";
import {
  RecipeDetailCompleteDto,
  Review
} from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetail() {
  const { user } = useUser();
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeDetailCompleteDto | null>(null);
  const [notes, setNotes] = useState<{ content: string }[]>([]);
  const [review, setReview] = useState<Review[]>([]);
  const [selectedServings, setSelectedServings] = useState<number>(1);


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
      setSelectedServings(data.servingSize ?? 1);
    };
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Notes/note/recipe/${recipeId}`, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!res.ok) throw new Error("Failed to load notes");
        const data = await res.json();
        setNotes(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    const fetchReviews = async () =>{
      try {
        const res =  await fetch(`${API_BASE_URL}api/Reviews/recipe/${recipeId}`,{
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if(!res.ok) throw new Error ("Failed to load reviews");
        const data = await res.json();
        const mappedReviews: Review[] = data.map((r: any) => ({
          username: r.user.username,
          content: r.content,
          isLiked: r.isLiked,
          date: new Date(r.createdAt),
          recipeId: r.recipeId,
        }));
    
        setReview(mappedReviews);
        } catch (err){
          console.error("Error fetching reviews:", err);
        }
    };
    fetchReviews();
    fetchRecipe();
    fetchNotes();
  }, [recipeId]);

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);

  const formatIngredientQuantity = (quantity?: number, measurementUnit?: string) => {
    if (quantity == null) return "";

    const baseServings = recipe?.servingSize ?? 1;
    const scaledQuantity = quantity * (selectedServings / (baseServings || 1));
    const displayQuantity = Number.isInteger(scaledQuantity)
      ? scaledQuantity
      : parseFloat(scaledQuantity.toFixed(2));

    return `${displayQuantity} ${measurementUnit || ""}`.trim();
  };

  const handleChangeServings = (newValue: number) => {
    setSelectedServings(Math.max(1, newValue));
  };

  const incrementServings = () => handleChangeServings(selectedServings + 1);
  const decrementServings = () => handleChangeServings(selectedServings - 1);

  if (!recipe) return <Text>Loading...</Text>;
  console.log("recipe detail: ", recipe);

  const imageUri = recipe.pictureDirectory?.[0];

  const saveToWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Wishlists/${recipeId}`, {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });

      const text = await res.text();

      if (!res.ok) {
        if (text.includes("Recipe existed in the wishlist")) {
          Alert.alert("Error", "Recipe existed in the wishlist");
        } else {
          Alert.alert("Error", `Failed to save: ${text}`);
        }
        return;
      }

      Alert.alert("Success", "Saved to wishlist");
    } catch (err) {
      console.error("Failed to start save to wishlist:", err);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  const addToShoppingList = async (recipeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/ShoppingLists/${recipeId}?serving=${selectedServings}`, {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert("Error", `Failed to add to shopping list: ${text}`);
        return;
      }

      Alert.alert("Success", "Added to shopping list!");
    } catch (err) {
      console.error("Error adding to shopping list:", err);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  // 🔹 Start cooking session before navigating
  const startCooking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/UserCookingSessions/start/${recipeId}`, {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to start cooking session:", err);
        return;
      }

      console.log("Cooking session started!");

      // 🔹 Navigate to step list after starting session
      router.push({
        pathname: "/(main)/Recipe/[recipeId]/RecipeStepList",
        params: { recipeId, steps: JSON.stringify(recipe.recipeSteps) },
      });
    } catch (error) {
      console.error("Error starting cooking session:", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Only ScrollView (and FlatList) supports contentContainerStyle */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}
            onPress={() => {
              router.push({
                pathname: "/(main)/home",
              })
            }}
          >
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
            <Text style={styles.RecipeRating}>Rating: {recipe.rating} </Text>
          </View>
          <View style={styles.RecipeAuthor}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Haven't return Author info right now so use placeholder instead */}
              <Image
                source={recipe.avatar ? { uri: `${URL}${recipe.avatar}` } : require("assets/images/icon.png")}
                style={styles.RecipeAuthorAvatar} />
              <Text style={styles.RecipeAuthorName}>{recipe.username}</Text>
            </View>
          </View>

          <Button title="Add to Shopping List" onPress={() => addToShoppingList(recipe.recipeId)} />

          <Button
            title="Save to wishlist"
            onPress={saveToWishlist}
          />
        </View>
        {/* Personal Notes */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>My Notes</Text>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <View key={index} style={styles.DescriptionCard}>
                <Text style={styles.DescriptionContent}>{note.content}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#666", marginTop: 8 }}>No notes yet for this recipe.</Text>
          )}
        </View>

        {/* Description */}
        <View style={[styles.DescriptionCard, {marginBottom: 10}]}>
          <Text style={styles.DescriptionLabel}>DESCRIPTION</Text>
          <Text style={styles.DescriptionContent}>{recipe.description}</Text>
        </View>

        {/* Info Bar: Serving Size, Cooking time */}
        <View style={styles.InfoBar}>
          <View style={[styles.InfoCard, { marginRight: 16 }]}>
            <Text style={styles.InfoLabel}>Serves </Text>
            <Text style={styles.InfoDetail}>{selectedServings}</Text>
          </View>
          <View style={styles.InfoCard}>
            <Text style={styles.InfoLabel}>Category </Text>
            <Text style={styles.InfoDetail}>
              {recipe.categories && recipe.categories.length > 0
                ? recipe.categories.map((c) => c.name).join(", ")
                : "Uncategorized"}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginRight: 16 }}>Adjust Servings</Text>
          <TouchableOpacity
            onPress={decrementServings}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#f1f1f1",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>-</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 12, fontSize: 16, fontWeight: "600" }}>{selectedServings}</Text>
          <TouchableOpacity
            onPress={incrementServings}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#f1f1f1",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>+</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 12, color: "#666" }}>
            Original: {recipe.servingSize ?? 1}
          </Text>
        </View>

        <View style={{ marginTop: 24 }}>
  <Text style={{ fontSize: 18, fontWeight: "600" }}>Reviews</Text>
  {review.length > 0 ? (
    review.map((rev, index) => (
      <ReviewCard key={index} review={rev} avatar={null} />
    ))
  ) : (
    <Text style={{ color: "#666", marginTop: 8 }}>No reviews yet.</Text>
  )}
</View>


        {/* INGREDIENT LIST */}
        <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600" }}>Ingredients</Text>
        {recipe.ingredients && recipe.ingredients.map((ing, index) => (
          <View key={`${ing.id}-${index}`} style={styles.CardList}>
            <View style={styles.CardListItem}>
              <Image source={ing.pictureDirectory ?
                { uri: `${URL}${ing.pictureDirectory}` }
                : require("assets/images/figma_images/Image1.png")} style={styles.CardListItemImage} />
              <Text style={styles.CardListItemName}>{ing.name}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#3c3c3c" }}>
              {formatIngredientQuantity(ing.quantity, ing.measurementUnit)}
            </Text>
          </View>
        ))}
        {/* UTENSIL LIST */}
        <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600" }}>Kitchen Utensils</Text>
        {recipe.kitchenUtensils && recipe.kitchenUtensils.map((ku, index) => (
          <View key={`${ku.kitchenUtensilId}-${index}`} style={styles.CardList}>
            <View style={styles.CardListItem}>
              <Image source={require("assets/images/icon.png")} style={styles.CardListItemImage} />
              <Text style={styles.CardListItemName}>{ku.name}</Text>
            </View>
          </View>
        ))}
        {/* <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>Steps</Text> */}
        {/* UTENSIL */}
        <TouchableOpacity
        >
          <Text style={[styles.RecipeDetailPageButton, styles.StepButton]} onPress={startCooking}>
            LET'S GET COOKING
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
