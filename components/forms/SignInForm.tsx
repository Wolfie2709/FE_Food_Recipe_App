import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/utils/apiConfig"; // <-- your config file

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Login pressed");
    const payload = { username: username.trim(), password: password.trim() };
  
    console.log("Request payload:", JSON.stringify(payload));
    try {
      const response = await fetch("http://192.168.1.107:5103/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        Alert.alert("Login failed", "Invalid username or password");
        return;
      }
  
      const data = await response.json();
      console.log("Access token:", data.accessToken); 
  
      router.push("/"); // <-- valid route
    } catch (error) {
      console.error("Login error:", error);
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

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} />

        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/register")}
        >
          New here? Signup
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
