import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { KitchenUtensil } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function KitchenUtensilsManagement() {
  const {user} = useUser();
  const [kitchenUtensil, setKU] = useState<KitchenUtensil[]>([]);
  const router = useRouter();

  // Load all recipes
  const loadKitchenUtensils = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/KitchenUtensils/utensil/pagination?page=1&pageSize=10`,
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
      setKU(data.utensilList);
    } catch (error) {
      console.error("Error loading kitchen utensils:", error);
    }
  };

  useEffect(() => {
    loadKitchenUtensils();
  }, []);

  // Create new recipe and navigate to AddNewRecipe
  const createKitchenUtensil = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }
  
      const res = await fetch(`${API_BASE_URL}api/KitchenUtensils/create-utensil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            name: " ",
            categoryId: 0,
            pictureDirectory: null
        }),
      });
  
      const raw = await res.text();
  
      if (!res.ok) {
        console.error("Failed to create recipe:", res.status, res.statusText, raw);
        return;
      }
  
      // Backend only returns plain text, so treat this as success
      if (raw.includes("success")) {
        console.log("Kitchen utensil created successfully");
  
        // Reload recipes
        await loadKitchenUtensils();
  
        // Navigate to the newest recipe (assuming API returns newest first)
        if (kitchenUtensil.length > 0) {
          const latest = kitchenUtensil.reduce((max, kU) => kU.kitchenUtensilId > max.kitchenUtensilId ? kU: max, kitchenUtensil[0]);
          router.push({
            pathname: "./AddKitchenUtensils",
            params: { kitchenUtensilId: latest.kitchenUtensilId.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };
  

  const renderItem: ListRenderItem<KitchenUtensil> = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() =>
        router.push({
          pathname: "/Recipe/add-recipe/AddNewRecipe",
          params: { kitchenUtensilId: item.kitchenUtensilId.toString() },
        })
      }
    >
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.kitchenUtensilId}</Text>
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
        <Button title="Add New Kitchen Utensil" onPress={createKitchenUtensil} />
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
              <Text style={styles.tableHeaderText}>Utensils</Text>
            </View>
          </View>
        </View>

        {/* Recipe list */}
        <FlatList
          data={kitchenUtensil}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.kitchenUtensilId.toString()}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

