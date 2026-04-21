import { tabbingStyles as styles } from "@/theme";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Tabbing() {
  const [activeTab, setActiveTab] = useState("Tab1");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tabbing</Text>
        <Text style={styles.headerSubtitle}>2 states of tabbings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Tab1" && styles.activeTab]}
          onPress={() => setActiveTab("Tab1")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Tab1" ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            Label
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Tab2" && styles.activeTab]}
          onPress={() => setActiveTab("Tab2")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Tab2" ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            Label
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

