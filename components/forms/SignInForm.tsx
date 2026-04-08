import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground } from "react-native";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/figma_images/image1.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>⭐ 60k+ Premium recipes</Text>

        {/* Rectangle → Username Input */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Rectangle → Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Rectangle → Login Button */}
        <Button title="Login" onPress={() => router.push("/(main)/home")} />

        <Text style={styles.link} onPress={() => router.push("/(main)/(auth)/SignUp")}>
          New here? Signup
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.4)" },
  title: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: "center" },
  label: { color: "#fff", marginBottom: 5 },
  input: {
    backgroundColor: "#D9D9D9", // 👈 matches your rectangle color
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  link: { color: "#fff", textAlign: "center", marginTop: 15 },
});
