import { useUser } from "@/components/userContext";
import { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function EditProfile() {
  const userObject = useUser();
  const token = userObject.user?.token;

  const [profile, setProfile] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch full profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: User = await res.json();
        setProfile(data);

        // Initialize form fields
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        Alert.alert("Error", "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Users/me`, {
        method: "PUT", // or PATCH depending on your API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updatedUser: User = await res.json();

      setProfile(updatedUser); // update local state
      Alert.alert("Success", "Profile updated successfully!");
      console.log("Updated user:", updatedUser);
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        {/* <Image
          source={require("../../../assets/images/Unsplashnsze2hlxozo.png")}
          style={styles.avatar}
        /> */}
        <Text style={styles.label}>Profile picture</Text>
      </View>

      {/* First Name */}
      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter first name"
      />

      {/* Last Name */}
      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter last name"
      />

      {/* Description */}
      {/* <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      /> */}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  header: { paddingVertical: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#303030" },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  label: { fontSize: 16, color: "#303030", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
