import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import EditRecipeStepForm from "../../../../components/forms/EditRecipeStepForm";

export default function EditCookingRecipeStep() {
  const route = useRoute();
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

  return (
    <View style={styles.container}>
      <EditRecipeStepForm recipeId={recipeId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
