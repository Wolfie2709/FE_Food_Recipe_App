import { useAuthStore } from "@/components/Store/authStore";
import NavigationBar from "@/components/ui/figma_navbar";
import { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProfilePage() {
  const { accessToken } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    if (accessToken) fetchProfile();
  }, [accessToken]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        {user.pictureId ? (
          <Image
            source={{ uri: user.pictureId.toString() }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ color: "#FFF", fontSize: 24 }}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Username */}
        <Text style={styles.username}>{user.username}</Text>

        {/* Basic Info */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email ?? "N/A"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.phoneNumber ?? "N/A"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Joined:</Text>
          <Text style={styles.value}>
            {new Date(user.createDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Bottom navigation bar */}
      {user && <NavigationBar user={user} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1, alignItems: "center", padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  avatarPlaceholder: {
    backgroundColor: "#E23E3E",
    justifyContent: "center",
    alignItems: "center",
  },
  username: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#303030" },
  infoBox: { flexDirection: "row", marginBottom: 8, width: "100%" },
  label: { fontWeight: "600", color: "#787A7C", marginRight: 8 },
  value: { color: "#303030" },
  message: { fontSize: 18, color: "#787A7C", marginTop: 40, textAlign: "center" },
});
