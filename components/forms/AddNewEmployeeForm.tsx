import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../userContext";

export default function AddNewEmployeeForm() {
  const { user } = useUser();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [sex, setSex] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter();

  const addNewEmployee = async () => {
    const payload = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      phonenumber: phonenumber.trim(),
      sex: sex.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}api/Auth/register`, {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      if (!response.ok) {
        console.error("Registration failed:", raw);
        Alert.alert("Registration failed", raw || "Please check your details");
        return;
      }

      let createdUserId: string | number | undefined;
      try {
        const parsed = JSON.parse(raw);
        createdUserId = parsed?.id || parsed?.user?.id;
      } catch {
        // Response is not JSON or not structured as expected.
      }

      if (!createdUserId) {
        const lookupRes = await fetch(
          `${API_BASE_URL}api/Users/users/pagination?username=${encodeURIComponent(username)}&page=1&pageSize=10`,
          {
            headers: {
              Authorization: user?.token ? `Bearer ${user.token}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        if (!lookupRes.ok) {
          const errText = await lookupRes.text();
          console.error("User lookup failed:", errText);
          Alert.alert("Error", "Could not fetch user after registration");
          return;
        }

        const lookupData = await lookupRes.json();
        createdUserId = lookupData.userList?.[0]?.id;
      }

      if (!createdUserId) {
        console.error("Could not determine created user ID after registration.");
        Alert.alert("Error", "Could not determine created user ID.");
        return;
      }

      const roleUpdateResponse = await fetch(
        `${API_BASE_URL}api/Users/user/role/change/${createdUserId}`,
        {
          method: "PUT",
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const roleUpdateText = await roleUpdateResponse.text();
      if (!roleUpdateResponse.ok) {
        console.error("Role update failed:", roleUpdateText);
        Alert.alert("Role update failed", roleUpdateText || "Could not assign role");
        return;
      }

      Alert.alert("Success", `Employee registered and role set to ${role}`);
      router.push("../UserManagement");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Employee</Text>
      </View>

      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter first name"
        value={firstname}
        onChangeText={setFirstname}
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter last name"
        value={lastname}
        onChangeText={setLastname}
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phonenumber}
        onChangeText={setPhonenumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Sex</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter sex"
        value={sex}
        onChangeText={setSex}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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

      <TouchableOpacity style={styles.saveButton} onPress={addNewEmployee}>
        <Text style={styles.saveButtonText}>Save Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { paddingVertical: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#303030" },
  label: { fontSize: 16, color: "#303030", marginVertical: 8, marginLeft: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFF",
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
