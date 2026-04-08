import Button from "@/components/ui/button";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/figma_images/Image1.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
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
        <Button title="Sign up" onPress={() => router.push("/login")} />

        <Link push href="/login" style={styles.link}>
          Already have account? Login
        </Link>
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
    backgroundColor: "#D9D9D9", // 👈 matches your rectangle color
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  link: { color: "#fff", textAlign: "center", marginTop: 15 },
});
