import React from "react";
import { StyleSheet, View } from "react-native";
import AddKitchenUtensilsForm from "../../../components/forms/AddKitchenUtensilsForm";

export default function AddCookingRecipe() {
  return (
    <View style={styles.container}>
      <AddKitchenUtensilsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
