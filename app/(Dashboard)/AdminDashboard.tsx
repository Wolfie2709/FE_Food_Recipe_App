import { Link } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { homeStyles as styles } from "../../theme";

const screenWidth = Dimensions.get("window").width;
const spacing = 10;
const itemWidth = screenWidth / 2 - spacing; // wider cards for admin stats

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
};

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// Fake data for dashboard
const fakeStats = [
  { title: "Recipes", value: 120, subtitle: "+5 last 7 days", color: "#E94B4B" },
  { title: "Ingredients", value: 340, subtitle: "+12 last 7 days", color: "#6FEF0E" },
  { title: "Users", value: 89, subtitle: "+3 last 7 days", color: "#A45EE2" },
  { title: "Reviews", value: 45, subtitle: "+7 last 7 days", color: "#C4E044" },
];

const fakeRecentRecipes = [
  { name: "Indonesian Chicken Burger", addedBy: "Adrianna Curl" },
  { name: "Homemade Pancake", addedBy: "James Wolden" },
  { name: "Seafood Fried Rice", addedBy: "Roberta Anny" },
];

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Panel</Text>
        <Text style={styles.sectionSubtitle}>Hi admin, welcome back</Text>
      </View>

      {/* Dashboard stats */}
      <View style={styles.sectionRow}>
        <StatCard {...fakeStats[0]} />
        <StatCard {...fakeStats[1]} />
      </View>
      <View style={styles.sectionRow}>
        <StatCard {...fakeStats[2]} />
        <StatCard {...fakeStats[3]} />
      </View>

      {/* Admin controls */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Admin Controls</Text>

  <Link push style={styles.link} href="./Recipe/RecipeManagement">
    Recipes
  </Link>

  {/* <Link push style={styles.link} href="/(Dashboard)/Ingredients">
    Ingredients
  </Link>

  <Link push style={styles.link} href="/(Dashboard)/Users">
    Users
  </Link>

  <Link push style={styles.link} href="/(Dashboard)/Reviews">
    Reviews
  </Link>

  <Link push style={styles.link} href="/(Dashboard)/Logging">
    Logging
  </Link> */}
</View>


      {/* Recent activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Recipes</Text>
        {fakeRecentRecipes.map((item, index) => (
          <View key={index} style={{ marginVertical: 8 }}>
            <Text style={styles.recipeTitle}>{item.name}</Text>
            <Text style={styles.recipeAuthor}>By {item.addedBy}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
