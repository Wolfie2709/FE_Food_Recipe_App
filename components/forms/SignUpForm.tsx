import Button from "@/components/ui/button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_BASE_URL } from "@/utils/apiConfig";


export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [sex, setSex] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
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

    console.log("Request payload:", JSON.stringify(payload));

    try {
      const response = await fetch("${API_BASE_URL}/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Read the body once
      const text = await response.text();

      if (!response.ok) {
        console.error("Registration failed:", text);
        Alert.alert("Registration failed", text || "Please check your details");
        return;
      }

      // Try to parse JSON if possible
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Registration response (text):", text);
        Alert.alert("Registration success", text);
        router.push("/(auth)/login");
        return;
      }

      console.log("Registration response:", data);

      if (data.accessToken) {
        console.log("Access token:", data.accessToken);
        // Save token in AsyncStorage or context
      }

      router.push("/(auth)/login");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/figma_images/Image1.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>⭐ 60k+ Premium recipes</Text>

        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstname}
          onChangeText={setFirstname}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastname}
          onChangeText={setLastname}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"   // shows number pad
          value={phonenumber}
          onChangeText={setPhonenumber}
          maxLength={10}             // optional limit
        />

        <Text style={styles.label}>Sex</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your sex"
          value={sex}
          onChangeText={setSex}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Register" onPress={handleRegister} />

        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/login")}
        >
          Already have an account? Log in
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: "center" },
  label: { color: "#fff", marginBottom: 5 },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  link: { color: "#fff", textAlign: "center", marginTop: 15 },
});
