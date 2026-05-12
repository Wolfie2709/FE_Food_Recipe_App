import AddNewEmployeeForm from "@/components/forms/AddNewEmployeeForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AddNewEmployee() {
  return (
    <View style={styles.container}>
      <AddNewEmployeeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
});
