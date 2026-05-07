import AddCategoryForm from "@/components/forms/AddCategoryForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AddCookingRecipe() {
  return (
    <View style={styles.container}>
      <AddCategoryForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
