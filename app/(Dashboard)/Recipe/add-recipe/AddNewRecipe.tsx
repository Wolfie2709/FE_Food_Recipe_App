import React from "react";
import { StyleSheet, View } from "react-native";
import AddRecipeForm from "../../../../components/forms/AddRecipeForm";

export default function AddCookingRecipe() {
  return (
    <View style={styles.container}>
      <AddRecipeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
