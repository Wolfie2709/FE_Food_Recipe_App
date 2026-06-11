import { useUser } from "@/components/userContext";
import { Category } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CategoryDropdownProps = {
  label?: string;
  selectedCategoryId: number | null;
  onSelect: (categoryId: number | null) => void;
  type?: "ingredient" | "recipe" | "utensil"; // allow reuse for different category types
};

export default function CategoryDropdown({
  label = "Select Category",
  selectedCategoryId,
  onSelect,
  type = "recipe",
}: CategoryDropdownProps) {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=30&type=${type}`,
          {
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();

        // ✅ Fix: use categoryList from response
        setCategories(Array.isArray(data.categoryList) ? data.categoryList : []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, [type, user?.token]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Picker
        selectedValue={selectedCategoryId ?? ""}
        style={styles.picker}
        onValueChange={(val) => {
          onSelect(val === "" ? null : Number(val));
        }}
      >
        <Picker.Item label="Select category..." value="" />
        {categories.map((cat) => (
          <Picker.Item
            key={cat.categoryId}
            label={cat.name}
            value={cat.categoryId}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  picker: { backgroundColor: "#f9f9f9", borderRadius: 8 },
});
