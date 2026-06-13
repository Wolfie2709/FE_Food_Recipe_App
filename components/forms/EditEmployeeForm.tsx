import { useUser } from "@/components/userContext";
import type { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditEmployeeForm() {
  const { user } = useUser();
  const { usersId } = useLocalSearchParams();
  const [employee, setEmployee] = useState<User | null>(null);
  const [role, setRole] = useState<User["role"]>("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!usersId) {
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/Users/${usersId}`, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to load user:", errorText);
          Alert.alert("Error", "Could not load employee details.");
          return;
        }

        const data: User = await response.json();
        setEmployee(data);
        setRole(data.role || "user");
      } catch (error) {
        console.error("Fetch employee error:", error);
        Alert.alert("Error", "Could not load employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [usersId, user?.token]);

  const updateRole = async () => {
    if (!usersId || !user?.token) {
      Alert.alert("Error", "Unable to update employee role.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}api/Users/user/role/change/${usersId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const text = await response.text();
      if (!response.ok) {
        console.error("Role update failed:", text);
        Alert.alert("Role update failed", text || "Could not update employee role.");
        return;
      }

      Alert.alert("Success", "Employee role updated successfully.");
      router.back();
    } catch (error) {
      console.error("Role update error:", error);
      Alert.alert("Error", "Could not update employee role.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E23E3E" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Employee not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Employee</Text>
      </View>

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={employee.username} editable={false} />

      <Text style={styles.label}>First name</Text>
      <TextInput style={styles.input} value={employee.firstName} editable={false} />

      <Text style={styles.label}>Last name</Text>
      <TextInput style={styles.input} value={employee.lastName} editable={false} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={employee.email || ""} editable={false} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={employee.phoneNumber || ""} editable={false} />

      <Text style={styles.label}>Sex</Text>
      <TextInput style={styles.input} value={employee.sex || ""} editable={false} />

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={updateRole} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Role"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" },
  header: { paddingVertical: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#303030" },
  title: { fontSize: 18, textAlign: "center", padding: 16, color: "#303030" },
  label: { fontSize: 16, color: "#303030", marginVertical: 8, marginLeft: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    color: "#6B6B6B",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  saveButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 32,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});