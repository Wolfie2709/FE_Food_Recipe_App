import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Ingredient } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";
import OverlayMenu from "../../../components/ui/overlay-menu";

export default function IngredientsManagement() {
  const {user} = useUser();
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // Load all recipes
  const loadIngredients = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/Ingredients/ingredient/pagination?page=1&pageSize=60`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to load  kitchen utensils:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setIngredient(data.ingredientList);
    } catch (error) {
      console.error("Error loading kitchen utensils:", error);
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
            measurementUnit: " ",
            categoryId: 7,
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
        if (ingredient.length > 0) {
          const latest = ingredient.reduce((max, ing) => ing.ingredientsId > max.ingredientsId ? ing: max, ingredient[0]);
          router.push({
            pathname: "./AddIngredients",
            params: { ingredientsId: latest.ingredientsId.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error creating ingredient:", error);
    }
  };
  

  const DeleteKU = async (ingredientsId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Recipes/${ingredientsId}`, {
        method: "DELETE",
        headers: { "Authorization": user?.token ? `Bearer ${user.token}` : "" },
      });
      if (res.ok) {
        console.log("Hard deleted successfully");
        await loadIngredients();
      } else {
        console.error("Hard delete failed");
      }
    } catch (err) {
      console.error("Error hard deleting recipe:", err);
    }
  };

  const searchIngredients = async (name: string) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}api/Ingredients/ingredient/pagination?ingredientName=${encodeURIComponent(name)}&page=1&pageSize=10`,
      {
        headers: {
          "Authorization": user?.token ? `Bearer ${user.token}` : "",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to search ingredients:", res.status, await res.text());
      return;
    }

    const data = await res.json();
    setIngredient(data.ingredientList);
  } catch (error) {
    console.error("Error searching ingredients:", error);
  }
};

  const renderItem: ListRenderItem<Ingredient> = ({ item }) => (
      <View style={styles.tableRow}>
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.ingredientsId}</Text>
      </View>

      <View style={styles.tableCellProduct}>
        <View style={styles.ProductCell}>
          <View>
            <Image
              source={
                item.pictureDirectory
                  ? { uri: `${URL}${item.pictureDirectory}` }
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

{/* Three-dot icon */}
<TouchableOpacity
      style={{marginRight: -1}}
        onPress={() =>
          setMenuVisibleId(menuVisibleId === item.ingredientsId ? null : item.ingredientsId)
        }
      >
        <Image source={require("assets/images/Union.png")} />
      </TouchableOpacity>

      {/* Context menu */}
      <OverlayMenu
        visible={menuVisibleId === item.ingredientsId}
        onClose={() => setMenuVisibleId(null)}
        items={
          menuVisibleId === item.ingredientsId
            ? [
                {
                  label: "Edit",
                  onPress: () =>
                    router.push({
                      pathname: "./EditIngredients",
                      params: { ingredientsId: item.ingredientsId.toString() },
                    }),
                },
                {
                  label: "Delete",
                  onPress: () => DeleteKU(item.ingredientsId),
                  destructive: true,
                },
              ]
            : []
        }
      />
      </View>

  );

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  console.log("URL: ", ingredient);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients Management</Text>

      {/* Search bar */}
     <View style={styles.searchBar}>
  <TextInput
    style={styles.searchText}
    placeholder="Search ingredients..."
    value={searchText}
    onChangeText={(text) => {
      setSearchText(text);
      if (text.trim().length > 0) {
        searchIngredients(text);
      } else {
        loadIngredients(); // fallback to full list
      }
    }}
  />
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
          data={ingredient}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.ingredientsId.toString()}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

