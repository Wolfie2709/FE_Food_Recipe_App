import { useUser } from "@/components/userContext";
import type { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsPage() {
  const { user, setUser } = useUser(); // ✅ fixed destructuring
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0]);

  // 🔹 Load user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Users/me`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error("Failed to load user info");
        const data: User = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    };
    if (user?.token) fetchUserInfo();
  }, [user]);

  // 🔹 Load cooking session data
  useEffect(() => {
    const fetchCookingStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/CookingSessions/stats`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setChartData([data.meat, data.fish, data.veggie, data.vegan, data.mf]);
      } catch (err) {
        console.error("Error loading cooking stats:", err);
      }
    };
    if (user?.token) fetchCookingStats();
  }, [user]);

  // 🔹 Sign out
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile & Settings</Text>

      {/* Account Settings */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Account Settings</Text>

  {/* Name */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={styles.infoLabel}>Name</Text>
    <Text style={styles.infoValue}>{userInfo?.firstName} {userInfo?.lastName}</Text>
  </TouchableOpacity>

  {/* Email */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={styles.infoLabel}>Email</Text>
    <Text style={[styles.infoValue, { fontWeight: "600" }]}>{userInfo?.email}</Text>
  </TouchableOpacity>

  {/* Profile Picture */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={styles.infoLabel}>Profile Picture</Text>
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>{userInfo?.username?.charAt(0).toUpperCase()}</Text>
    </View>
  </TouchableOpacity>

  {/* Password */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={styles.infoLabel}>Password</Text>
    <Text style={styles.infoValue}>********</Text>
  </TouchableOpacity>

  {/* My Household */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={styles.infoLabel}>My Household</Text>
  </TouchableOpacity>

  {/* Delete Account */}
  <TouchableOpacity style={styles.infoBox}>
    <Text style={[styles.infoLabel, { color: "#E23E3E" }]}>Delete Account</Text>
  </TouchableOpacity>
</View>
      {/* Cooking Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cooking Breakdown</Text>
        {/* <BarChart
          data={{
            labels: ["MEAT", "FISH", "VEGGIE", "VEGAN", "M&F"],
            datasets: [{ data: chartData }],
          }}
          width={340}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => "#E23E3E",
            labelColor: () => "#303030",
          }}
          style={{ borderRadius: 12 }}
        /> */}
      </View>

      {/* Support & Logout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.row}><Text>About App</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text>Terms of Use</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text>FAQ</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text>Ask for Help</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoutButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { textAlign: "center", color: "#999", marginTop: 16 },
  infoBox: {
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginBottom: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},
infoLabel: {
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
},
infoValue: {
  fontSize: 16,
  color: "#000",
},
avatarCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#A8E063",
  justifyContent: "center",
  alignItems: "center",
},
avatarText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#000",
},

});
