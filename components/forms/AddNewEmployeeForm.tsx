import Button from "@/components/ui/button";
import { employeeFormStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import Field from "../ui/figma_input_fields";
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

  const AddNewEmployee = async () => {
    console.log("Register pressed");

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
      // Step 1: Register
      const response = await fetch(`${API_BASE_URL}api/Auth/register`, {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (!response.ok) {
        console.error("Registration failed:", text);
        Alert.alert("Registration failed", text || "Please check your details");
        return;
      }

      console.log("Registration response (text):", text);

      // Step 2: Fetch all users and get the latest one
      const lookupRes = await fetch(`${API_BASE_URL}api/Users/all`, {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
          "Content-Type": "application/json"
        }
      });

      if (!lookupRes.ok) {
        const errText = await lookupRes.text();
        console.error("User lookup failed:", errText);
        Alert.alert("Error", "Could not fetch users after registration");
        return;
      }

      const allUsers = await lookupRes.json();
      console.log("Fetched all users:", allUsers);

      // Assume newest user is the one with the highest id
      const latestUser = allUsers.reduce((prev: any, curr: any) =>
        prev.id > curr.id ? prev : curr
      );

      console.log("Latest user:", latestUser);

      // Step 3: Update role
      if (latestUser?.id) {
        const updateResponse = await fetch(`${API_BASE_URL}api/Users/user/role/change/${latestUser.id}`, {
          method: "PUT",
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ role }),
        });

        const updateText = await updateResponse.text();
        if (!updateResponse.ok) {
          console.error("Role update failed:", updateText);
          Alert.alert("Role update failed", updateText);
          return;
        }

        console.log("Role update success:", updateText);
        Alert.alert("Success", `Employee registered and role set to ${role}`);
        router.push("../UserManagement");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.overlay}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstname}
          onChangeText={setFirstname}
          maxLength={50}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastname}
          onChangeText={setLastname}
          maxLength={50}
        />

        <Text style={styles.label}>Username</Text>
        <Field
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          maxLength={50}
        />

        <Text style={styles.label}>Email</Text>
        <Field
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          maxLength={50}
        />

        <Text style={styles.label}>Phone number</Text>
        <Field
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phonenumber}
          onChangeText={setPhonenumber}
          maxLength={10}
        />

        <Text style={styles.label}>Sex</Text>
        <Field
          placeholder="Enter your sex"
          value={sex}
          onChangeText={setSex}
          maxLength={10}
        />

        <Text style={styles.label}>Password</Text>
        <Field
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          maxLength={50}
        />

        <Text style={styles.label}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        <Button title="Add new employee" onPress={AddNewEmployee} />
      </View>
    </ScrollView>
  );
}
