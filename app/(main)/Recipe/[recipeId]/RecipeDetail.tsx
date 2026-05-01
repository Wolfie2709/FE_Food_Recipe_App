// import { useUser } from "@/components/userContext";
// import { Category, Ingredient, KitchenUtensil, Recipe, RecipeCategoryInfoDto, RecipeIngredient, RecipeKitchenUtensilsInfoDto } from "@/types";
// import { API_BASE_URL } from "@/utils/apiConfig";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Image, ScrollView, Text, View } from "react-native";

// export default function RecipeDetail() {
//   const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const { user } = useUser();
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [serves, setServes] = useState("1");
//   const [cookTime, setCookTime] = useState("0");
//   const [ingredients, setIngredients] = useState<Ingredient[]>([]);
//   const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
//     { ingredientsId: null, quantity: "" },
//   ]);
//   const [recipeCategories, setRecipeCategories] = useState<RecipeCategoryInfoDto[]>([
//     { CategoriesId: null},
//   ]);
//   const [recipeKU, setRecipeKU] = useState<RecipeKitchenUtensilsInfoDto[]>([
//     {KitchenUtensilsId: null },
//   ]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [kitchenUtensils, setKitchenUtensils] = useState<KitchenUtensil[]>([]);
//   const [recipeImage, setRecipeImage] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       const res = await fetch(`${API_BASE_URL}api/Recipes/${recipeId}`);
//       const data = await res.json();
//       setRecipe(data);
//     };
//     fetchRecipe();
//   }, [recipeId]);

//   if (!recipe) return <Text>Loading...</Text>;

//   return (
//     <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold" }}>{recipe.name}</Text>
//       <Text>{recipe.description}</Text>
//       <Text>Serves: {recipe.servingSize} | Cook Time: {recipe.cookingTime} mins</Text>

//       <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>Ingredients</Text>
//       {recipeIngredients.map((ing) => (
//         <View key={ing.ingredientsId} style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
//           {ing.imageUrl && <Image source={{ uri: ing.imageUrl }} style={{ width: 40, height: 40, marginRight: 8 }} />}
//           <Text>{ing.} - {ing.quantity}</Text>
//         </View>
//       ))}

//       <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>Kitchen Utensils</Text>
//       {recipe.kitchenUtensils.map((ku) => (
//         <Text key={ku.kitchenUtensilId}>{ku.name}</Text>
//       ))}

//       <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600" }}>Steps</Text>
//       {recipe.recipeSteps.map((step) => (
//         <View key={step.stepId} style={{ marginVertical: 8 }}>
//           <Text style={{ fontWeight: "500" }}>{step.name}</Text>
//           <Text>{step.description}</Text>
//           {step.imageUrl && <Image source={{ uri: step.imageUrl }} style={{ width: 100, height: 100, marginTop: 4 }} />}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }
