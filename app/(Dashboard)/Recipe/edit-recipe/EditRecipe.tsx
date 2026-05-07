import EditRecipeForm from "@/components/forms/EditRecipeForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AddCookingRecipe() {
  return (
    <View style={styles.container}>
      <EditRecipeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
