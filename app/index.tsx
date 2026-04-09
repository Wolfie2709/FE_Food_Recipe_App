import { Link } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

type Creator = { name: string; image: any };
type Recipe = { title: string; author: string; image: any; time?: string };

const creators: Creator[] = [
  { name: "Troyan Smith", image: require("@/assets/images/figma_images/Unsplashwnolnjo7ts8.png") },
  { name: "James Wolden", image: require("@/assets/images/figma_images/Unsplashgewnwhggxls.png") },
  { name: "Niki Samantha", image: require("@/assets/images/figma_images/Unsplashij24uq1smwm.png") },
  { name: "Roberta Anny", image: require("@/assets/images/figma_images/Unsplashsfdbi7p47xe.png") },
];

const recentRecipes: Recipe[] = [
  { title: "Indonesian chicken burger", author: "Adrianna Curl", image: require("@/assets/images/figma_images/Image7.png") },
  { title: "Home made cute pancake", author: "James Wolden", image: require("@/assets/images/figma_images/Image9.png") },
  { title: "Seafood fried rice", author: "Roberta Anny", image: require("@/assets/images/figma_images/Image10.png") },
];

const trendingRecipes: Recipe[] = [
  { title: "How to make sushi at home", author: "Niki Samantha", image: require("@/assets/images/figma_images/Image4.png") },
  { title: "How to make sandwich", author: "Troyan Smith", image: require("@/assets/images/figma_images/Image6.png") },
];

function CreatorCard({ name, image }: Creator) {
  return (
    <View style={styles.creator}>
      <Image source={image} style={styles.avatar} />
      <Text style={styles.creatorName}>{name}</Text>
    </View>
  );
}

function RecipeCard({ title, author, image, time }: Recipe) {
  return (
    <View style={styles.recipeCard}>
      <Image source={image} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{title}</Text>
      <Text style={styles.recipeAuthor}>By {author}</Text>
      {time && <Text style={styles.recipeTime}>⏱ {time}</Text>}
    </View>
  );
}

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Popular creators */}
      <View style={styles.section}>
      <Link push style={styles.link} href="/login">
          Login
        </Link>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular creators</Text>
          <Text style={styles.link}>See all</Text>
        </View>
        <View style={styles.creatorRow}>
          {creators.map((c) => (
            <CreatorCard key={c.name} {...c} />
          ))}
        </View>
      </View>

      {/* Recent recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent recipes</Text>
          <Text style={styles.link}>See all</Text>
        </View>
        <View style={styles.recipeRow}>
          {recentRecipes.map((r) => (
            <RecipeCard key={r.title} {...r} />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular categories</Text>
        <View style={styles.categoryRow}>
          {["Salad", "Breakfast", "Appetizer", "Noodle", "Lunch"].map((cat) => (
            <Text
              key={cat}
              style={[
                styles.category,
                cat === "Breakfast" && styles.categoryActive,
              ]}
            >
              {cat}
            </Text>
          ))}
        </View>
      </View>

      {/* Trending */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending now 🔥</Text>
          <Text style={styles.link}>See all</Text>
        </View>
        <View style={styles.recipeRow}>
          {trendingRecipes.map((r) => (
            <RecipeCard key={r.title} {...r} />
          ))}
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.section}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search recipes</Text>
        </View>
      </View>

      {/* Hero tagline */}
      <View style={styles.section}>
        <Text style={styles.heroText}>Find best recipes for cooking</Text>
        <Link push style={styles.link} href="/login">
          Login
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { padding: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#303030" },
  link: { color: "#E23E3E", fontSize: 14, fontWeight: "500" },
  creatorRow: { flexDirection: "row", gap: 12 },
  creator: { alignItems: "center", marginRight: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  creatorName: { marginTop: 4, fontSize: 12, fontWeight: "500", color: "#303030" },
  recipeRow: { flexDirection: "row", gap: 12 },
  recipeCard: { width: 120, marginRight: 12 },
  recipeImage: { width: "100%", height: 80, borderRadius: 8 },
  recipeTitle: { fontSize: 14, fontWeight: "600", color: "#303030", marginTop: 4 },
  recipeAuthor: { fontSize: 12, color: "#A9A9A9" },
  recipeTime: { fontSize: 12, color: "#303030", fontWeight: "500" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  category: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#E23E3E", color: "#E23E3E", fontSize: 12, fontWeight: "500" },
  categoryActive: { backgroundColor: "#E23E3E", color: "#fff" },
  searchBar: { borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, padding: 10 },
  searchPlaceholder: { color: "#C1C1C1", fontSize: 14 },
  heroText: { fontSize: 20, fontWeight: "600", color: "#303030", marginBottom: 8 },
});
