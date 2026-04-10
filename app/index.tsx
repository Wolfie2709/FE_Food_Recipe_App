import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { onboardingStyles as styles } from "../theme";

export default function Onboarding() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background image */}
      <Image
        source={require("../assets/images/figma_images/Image1.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay gradient */}
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⭐</Text>
        <Text style={styles.headerText}>60k+ Premium recipes</Text>
      </View>

      {/* Title and subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Let’s Cooking</Text>
        <Text style={styles.subtitle}>Find best recipes for cooking</Text>
      </View>

      {/* Button */}
      <Link href="./(auth)/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start cooking</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
