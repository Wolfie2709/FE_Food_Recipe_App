import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingCart() {
  const { user } = useUser();
  const [shoppingList, setShoppingList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadShoppingList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/ShoppingLists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setShoppingList(data);
    } catch (err) {
      console.error("Error loading shopping list:", err);
      Alert.alert("Error", "Could not load shopping list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingList();
  }, []);

  const parseIngredientQuantity = (quantity: any) => {
    if (quantity == null) return 0;
    if (typeof quantity === "number") return quantity;
    const parsed = parseFloat(String(quantity).replace(/[^0-9.\-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const calculateIngredientCost = (ing: any) => {
    if (ing == null) return 0;
    const parsed = parseFloat(String(ing.price ?? 0).replace(/[^0-9.\-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const parseNumber = (value: any) => {
    if (value == null) return 0;
    if (typeof value === "number") return value;
    const parsed = parseFloat(String(value).replace(/[^0-9.\-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const getRecipeServing = (recipe: any) => {
    return Math.max(1, parseNumber(recipe?.serving ?? recipe?.servingSize ?? 1));
  };

  const getRecipeCost = (recipe: any) => {
    const backendTotal = parseNumber(recipe?.totalPrice);
    if (backendTotal > 0) return backendTotal;

    const baseCost = calculateRecipeCost(recipe?.ingredients || []);
    return baseCost * getRecipeServing(recipe);
  };

  const calculateRecipeCost = (ingredients: any[]) => {
    if (!ingredients || ingredients.length === 0) return 0;
    return ingredients.reduce((total, ing) => total + calculateIngredientCost(ing), 0);
  };

  const calculateTotalShoppingCost = () => {
    if (!shoppingList?.recipes || shoppingList.recipes.length === 0) return 0;
    return shoppingList.recipes.reduce((total: number, recipe: any) => {
      return total + getRecipeCost(recipe);
    }, 0);
  };

  const totalShoppingCost = calculateTotalShoppingCost();

  if (loading) return <Text>Loading shopping list...</Text>;
  if (!shoppingList || shoppingList.numberOfRecipes === 0)
    return <Text>No recipes in your shopping list yet.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
          Shopping Cart
        </Text>
        <Text style={{ fontSize: 18, color: "#555", marginBottom: 20 }}>
          Shopping cart for saved recipes
        </Text>

        {/* Render each recipe block */}
        {shoppingList.recipes.map((recipe: any) => (
  <View key={recipe.recipeId} style={{ marginBottom: 30 }}>
    {/* Recipe name and cost */}
    <View
      style={{
        borderWidth: 1,
        borderColor: "#E23E3E",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#E23E3E" }}>
        {recipe.name}
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
        Servings: {getRecipeServing(recipe)}
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
        Total Cost: {getRecipeCost(recipe).toLocaleString()}
      </Text>
    </View>

    {/* Ingredients header */}
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
  Ingredients
</Text>

{recipe.ingredients.map((ing: any, index: number) => {
  const ingredientQuantity = parseIngredientQuantity(ing.quantity);
  const ingredientCost = calculateIngredientCost(ing);
  return (
    <View
      key={`${ing.ingredientsId}-${index}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 10,
        padding: 8,
      }}
    >
      <Image
        source={
          ing.pictureDirectory
            ? { uri: `${API_BASE_URL}${ing.pictureDirectory}` }
            : require("assets/images/icon.png")
        }
        style={{ width: 40, height: 40, marginRight: 10, borderRadius: 6 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: "#303030" }}>{ing.name}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, color: "#303030" }}>
          {ingredientQuantity} {ing.measurementUnit}
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          Cost: {ingredientCost.toLocaleString()}
        </Text>
      </View>
    </View>
  );
})}
  </View>
))}

      {/* Grand Total */}
      <View
        style={{
          borderTopWidth: 2,
          borderTopColor: "#E23E3E",
          paddingTop: 20,
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#E23E3E" }}>
          Total Shopping Cost
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#E23E3E", marginTop: 8 }}>
          {totalShoppingCost.toLocaleString()}
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
