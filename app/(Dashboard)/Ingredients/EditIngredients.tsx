import EditIngredientForm from "@/components/forms/EditIngredientForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AddCookingRecipe() {
  return (
    <View style={styles.container}>
      <EditIngredientForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
