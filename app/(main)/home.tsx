import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Popular creators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular creators</Text>
        <Text style={styles.link}>See all</Text>

        <View style={styles.creatorRow}>
          <View style={styles.creator}>
            <Image
              source={require("@/assets/images/figma_images/Unsplashsfdbi7p47xe.png")}
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>Roberta Anny</Text>
          </View>

          <View style={styles.creator}>
            <Image
              source={require("@/assets/images/figma_images/Unsplashij24uq1smwm.png")}
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>Niki Samantha</Text>
          </View>

          <View style={styles.creator}>
            <Image
              source={require("@/assets/images/figma_images/Unsplashwnolnjo7ts8.png")}
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>James Wolden</Text>
          </View>

          <View style={styles.creator}>
            <Image
              source={require("@/assets/images/figma_images/Unsplash243q39dzm3m.png")}
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>Troyan Smith</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#303030" },
  link: { color: "#E23E3E", fontSize: 14, fontWeight: "500", marginTop: 5 },
  creatorRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  creator: { alignItems: "center" },
  avatar: { width: 75, height: 75, borderRadius: 75 },
  creatorName: { marginTop: 8, fontSize: 12, fontWeight: "500", color: "#303030" },
});
