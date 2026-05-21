import Button from "@/components/ui/button";
import { authStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ImageBackground,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleForgotPassword = async () => {
    const payload = { username: username.trim(), password: newPassword.trim() };

    try {
      const response = await fetch(`${API_BASE_URL}api/Users/forgot-password`, {
        method: "PUT", // or POST depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg = await response.text();
        Alert.alert("Failed", msg || "Could not reset password");
        return;
      }

      const result = await response.text(); // backend may return plain text
      Alert.alert("Success", result || "Password updated successfully!");

      // Redirect back to login
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/figma_images/Image1.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🔑 Reset your password</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Button title="Reset Password" onPress={handleForgotPassword} />

        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/login")}
        >
          Back to Login
        </Text>
      </View>
    </ImageBackground>
  );
}
