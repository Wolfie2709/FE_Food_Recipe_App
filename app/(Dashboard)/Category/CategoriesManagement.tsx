import Button from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { Category } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function CategoryManagement() {
  const { user } = useUser();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Categories/search?categoryName=&page=1&pageSize=50&type=`, {
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch categories:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create empty category then navigate to AddCategoryForm
  const createEmptyCategory = async () => {
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

      const raw = await res.text();
      if (!res.ok) {
        console.error("Failed to create category:", res.status, raw);
        return;
      }

      const data = JSON.parse(raw);
      router.push({
        pathname: "./AddCategoryForm",
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

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={{ padding: 12, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>
        Type:{" "}
        {item.ingredientCategory
          ? "Ingredient"
          : item.kitchenCategory
          ? "Kitchen"
          : "Recipe"}
      </Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "./AddCategoryForm",
              params: { categoryId: item.categoryId.toString() },
            })
          }
          style={{ marginRight: 12 }}
        >
          <Text style={{ color: "blue" }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => softDeleteCategory(item.categoryId)}>
          <Text style={{ color: "red" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Category Management</Text>
      <Button title="Create Empty Category" onPress={createEmptyCategory} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={renderCategory}
      />
    </View>
  );
}
