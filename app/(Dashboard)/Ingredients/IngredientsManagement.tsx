import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Ingredient } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function IngredientsManagement() {
  const {user} = useUser();
  const [Ingredient, setIngredient] = useState<Ingredient[]>([]);
  const router = useRouter();

  // Load all recipes
  const loadIngredients = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/Ingredients/ingredient/pagination?page=1&pageSize=10`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to load ingredients:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setIngredient(data.ingredientList);
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  // Create new recipe and navigate to AddNewRecipe
  const createIngredient = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }
  
      const res = await fetch(`${API_BASE_URL}api/Ingredients/create-ingredient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            name: " ",
            measurementUnit:" ",
            categoryId: 0,
            pictureDirectory: null
        }),
      });
  
      const raw = await res.text();
  
      if (!res.ok) {
        console.error("Failed to create ingredient:", res.status, res.statusText, raw);
        return;
      }
  
      // Backend only returns plain text, so treat this as success
      if (raw.includes("success")) {
        console.log("Ingredient created successfully");
  
        // Reload recipes
        await loadIngredients();
  
        // Navigate to the newest recipe (assuming API returns newest first)
        if (Ingredient.length > 0) {
          const latest = Ingredient.reduce((max, Ing) => Ing.ingredientsId > max.ingredientsId ? Ing: max, Ingredient[0]);
          router.push({
            pathname: "./AddIngredients",
            params: { ingredientsId: latest.ingredientsId.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };
  

  const renderItem: ListRenderItem<Ingredient> = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() =>
        router.push({
          pathname: "/Recipe/add-recipe/AddNewRecipe",
          params: { ingredientsId: item.ingredientsId.toString() },
        })
      }
    >
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.ingredientsId}</Text>
      </View>

      <View style={styles.tableCellProduct}>
        <View style={styles.ProductCell}>
          <View>
            <Image
              source={
                item.imageUrl
                  ? { uri: `${URL}${item.imageUrl}` }
                  : require("assets/images/icon.png")
              }
              style={styles.ImageContent}
              resizeMode="cover"
            />
          </View>

          <View style={styles.ProductInformation}>
            <Text style={styles.tableCellText}>
              {item.name || "Untitled"}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Image source={require("assets/images/Union.png")} />
      </View>
    </TouchableOpacity>
  );

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Utensils</Text>
      <Text style={styles.title}>Kitchen Utensils Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchText} placeholder="Search recipes..." />
        <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
      </View>

      {/* Filter + Add New Recipe buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={() => { }} />
        <Button title="Add New Ingredient" onPress={createIngredient} />
      </View>

      {/* Table */}
      <View style={styles.boxListTable}>
        {/* Table header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderTextId}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>ID</Text>
            </View>
          </View>
          <View style={styles.tableHeaderTextProducts}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>Ingredients</Text>
            </View>
          </View>
        </View>

        {/* Recipe list */}
        <FlatList
          data={Ingredient}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.ingredientsId.toString()}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

