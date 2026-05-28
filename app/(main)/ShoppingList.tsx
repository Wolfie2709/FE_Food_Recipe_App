import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingCart() {
  const { user } = useUser();
  const [shoppingList, setShoppingList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadShoppingList = async () => {
    try {
      const stored = await AsyncStorage.getItem("shoppingList");
      const recipeIds = stored ? JSON.parse(stored) : [];

      const response = await fetch(`${API_BASE_URL}api/ShoppingLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify(recipeIds),
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
    {/* Recipe name */}
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
    </View>

    {/* Ingredients header */}
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
  Ingredients
</Text>

{recipe.ingredients.map((ing: any, index: number) => (
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
    <Text style={{ fontSize: 16, color: "#303030" }}>
      {ing.quantity} {ing.measurementUnit}
    </Text>
  </View>
))}
  </View>
))}

      </ScrollView>
    </SafeAreaView>
  );
}
