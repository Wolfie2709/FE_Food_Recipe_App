// import { useAuthStore } from "@/components/Store/authStore";
import Button from "@/components/ui/button";
import NavigationBar from "@/components/ui/figma_navbar";
import { useUser } from "@/components/userContext";
import { profilePageStyles as styles } from "@/theme";
import { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  // const { accessToken } = useAuthStore();
  const userObject = useUser();
  const [user, setUser] = useState<User | null>(null);
  const accessToken = userObject.user?.token;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Users/me`, {
          headers: {
            Authorization: `Bearer ${userObject.user?.token}`,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <View>
          <Image
            source={require("../../../../assets/images/SettingsIcon.png")}
            style={styles.settings}
          />
        </View>
        <View style={styles.headerInfo}>
          {/* Avatar */}
          {user.pictureId ? (
            <Image
              source={{ uri: user.pictureId.toString() }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={[styles.username]}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {user.role === "admin" && (
            <Button
              title="Admin Panel"
              variant="primary"
              size="large"
              onPress={() => {
                console.log("Admin button pressed");
                router.push("/(Dashboard)/AdminDashboard")
              }}
            />
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
          <Button 
          title = "Edit Profile"
          variant="primary"
          size = "small"
          onPress={() => {
            console.log("Edit profile button pressed")
            router.push("./EditProfile")
          } }
          />
        </View>
      </View>
      <View>
        {/* Bottom navigation bar */}
        {user && <NavigationBar user={user} />}
      </View>
    </SafeAreaView>
  );
}

