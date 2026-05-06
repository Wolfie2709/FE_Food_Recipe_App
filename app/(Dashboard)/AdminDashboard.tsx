import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { homeStyles as styles } from "../../theme";

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

const fakeStats = [
  { title: "Recipes", value: 120, subtitle: "5 in last 7 days", color: "#E94B4B" },
  { title: "Ingredients", value: 340, subtitle: "12 in last 7 days", color: "#6FEF0E" },
  { title: "Users", value: 89, subtitle: "3 in last 7 days", color: "#A45EE2" },
  { title: "Reviews", value: 45, subtitle: "7 in last 7 days", color: "#C4E044" },
];

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Panel</Text>
        <Text style={styles.sectionSubtitle}>Hi admin, welcome back to your admin panel.</Text>
      </View>

      {/* Stats */}
      <View style={styles.sectionRow}>
        <StatCard {...fakeStats[0]} />
        <StatCard {...fakeStats[1]} />
      </View>
      <View style={styles.sectionRow}>
        <StatCard {...fakeStats[2]} />
        <StatCard {...fakeStats[3]} />
      </View>

      {/* Admin Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <Link push style={styles.link} href="./Recipe/RecipeManagement">
          Recipes
        </Link>

        <Link push style={styles.link} href="./(Dashboard)/Ingredients">
          Ingredients
        </Link>

  <Link push style={styles.link} href="./KitchenUtensils/KitchenUtensilsManagement">
    KitchenUtensils
  </Link>

        {/* <Link push style={styles.link} href="/(Dashboard)/Users">
    Users
  </Link> */}

        {/* <Link push style={styles.link} href="/(Dashboard)/Reviews">
    Reviews
  </Link> */}

        {/*  <Link push style={styles.link} href="/(Dashboard)/Logging">
     Logging
 </Link>  */}
      </View>


      {/* Bottom sections */}
      <View style={styles.sectionRow}>
        {["Time", "Recipes", "Ingredients", "Charts", "Users", "Reviews"].map((section) => (
          <View key={section} style={styles.statCard}>
            <Text style={styles.statTitle}>{section}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
