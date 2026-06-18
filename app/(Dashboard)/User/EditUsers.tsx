import EditEmployeeForm from "@/components/forms/EditEmployeeForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function EditUsers() {
  return (
    <View style={styles.container}>
      <EditEmployeeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
});