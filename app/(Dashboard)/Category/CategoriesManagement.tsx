import Button from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import { Category } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CategoryManagement() {
  const { user } = useUser();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=10&type=all`, {
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch categories:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      setCategories(data.categoryList);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create empty category then navigate to AddCategoryForm
  const createCategory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Categories/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: "Untitled Category",
          description: null,
          ingredientCategory: false,
          kitchenCategory: false,
          pictureDirectory: null,
        }),
      });
  
      if (!res.ok) {
        console.error("Failed to create category:", res.status, await res.text());
        return;
      }
  
      // Consume the response once
      const raw = await res.text();
  
      // Try to parse JSON, fallback to text
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        console.log("Non‑JSON response:", raw);
  
        // Fallback: re-fetch categories and navigate to the newest one
        await fetchCategories();
        // Grab the last category (assuming API returns sorted list)
        const latest = categories[categories.length - 1];
        if (latest) {
          router.push({
            pathname: "./AddCategories",
            params: { categoryId: latest.categoryId.toString() },
          });
        }
        return;
      }
  
      // If backend returns JSON with categoryId
      router.push({
        pathname: "./AddCategories",
        params: { categoryId: data.categoryId.toString() },
      });
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };
  
  // Soft delete category
  const softDeleteCategory = async (categoryId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Categories/update-category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ isActive: false }),
      });
      if (!res.ok) {
        console.error("Failed to delete category:", res.status, await res.text());
        return;
      }
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };
  const renderItem: ListRenderItem<Category> = ({ item }) => (
    <View style={styles.tableRow}>
    <View style={styles.tableCellId}>
      <Text style={styles.tableCellText}>{item.categoryId}</Text>
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
        setMenuVisibleId(menuVisibleId === item.categoryId ? null : item.categoryId)
      }
    >
      <Image source={require("assets/images/Union.png")} />
    </TouchableOpacity>

    {/* Context menu */}
    {menuVisibleId === item.categoryId && (
      <View style={styles.contextMenu}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "./EditCategories",
              params: { categoryId : item.categoryId.toString() },
            })
          }
        >
          <Text style={styles.menuItem}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => softDeleteCategory(item.categoryId)}>
          <Text style={styles.menuItem}>Delete</Text>
        </TouchableOpacity>
      </View>
    )}
    </View>

);

const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
console.log("URL: ", categories);
return (
  <View style={styles.container}>
    <Text style={styles.title}>Categories Management</Text>

    {/* Search bar */}
    <View style={styles.searchBar}>
      <TextInput style={styles.searchText} placeholder="Search categories..." />
      <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
    </View>

    {/* Filter + Add New Recipe buttons */}
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
      <Button title="Filter" onPress={() => { }} />
      <Button title="Add New Category" onPress={createCategory} />
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
            <Text style={styles.tableHeaderText}>Category</Text>
          </View>
        </View>
      </View>

      {/* Recipe list */}
      <FlatList
        data={categories}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.categoryId.toString()}
        // style={styles.boxList}
        renderItem={renderItem}
      />
    </View>
  </View>
);
}


