// import { useAuthStore } from "@/components/Store/authStore";
import Button from "@/components/ui/button";
import NavigationBar from "@/components/ui/figma_navbar";
import { useUser } from "@/components/userContext";
import { profilePageStyles as styles } from "@/theme";
import { RecipeBox, User, UserRecipeHistory } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../../Search";

export default function ProfilePage() {
  // const { accessToken } = useAuthStore();
  const userObject = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "history">("recent");
  const accessToken = userObject.user?.token;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<UserRecipeHistory[]>([]);
  const [userRecipe, setUserRecipe] = useState<RecipeBox[]>([]);

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

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/UserRecipeHistory`, {
        headers: {
          Authorization: `Bearer ${userObject.user?.token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: UserRecipeHistory[] = await response.json();
      setHistory(res);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const loadCreatedRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/Recipes/user?page=1&pageSize=20`, {
        headers: {
          Authorization: `Bearer ${userObject.user?.token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const userRecipes: RecipeBox[] = await response.json();
      setUserRecipe(userRecipes);
    } catch (err) {
      console.error("Error loading user recipes:", err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([loadHistory(), loadCreatedRecipes()]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading profile...</Text>
      </View>
    );
  }

  if (loading) return <Text>Loading history...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            title="Edit Profile"
            variant="primary"
            size="small"
            onPress={() => {
              console.log("Edit profile button pressed")
              router.push("./EditProfile")
            }}
          />
          <Button
            title="Settings"
            variant="secondary"
            size="small"
            onPress={() => {
              console.log("Settings button pressed");
              router.push("./SettingsPage");
            }}
          />

        </View>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "recent" && styles.tabButtonActive]}
            onPress={() => setActiveTab("recent")}
          >
            <Text style={[styles.tabButtonText, activeTab === "recent" && styles.tabButtonTextActive]}>
              Recent Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "history" && styles.tabButtonActive]}
            onPress={() => setActiveTab("history")}
          >
            <Text style={[styles.tabButtonText, activeTab === "history" && styles.tabButtonTextActive]}>
              Recipe History
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "recent" ? (
          <FlatList
            data={userRecipe}
            keyExtractor={(item) => item.recipeId.toString()}
            nestedScrollEnabled
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "./[recipeId]/RecipeDetail",
                    params: { recipeId: item.recipeId.toString() },
                  })
                }
              >
                <View style={{ marginTop: 16, marginBottom: 16 }}>
                  <RecipeCard {...item} />
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            nestedScrollEnabled
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyTitle}>Recipe #{item.recipeId}</Text>
                <Text style={styles.historyMeta}>
                  Cooked at {new Date(item.cookedAt).toLocaleDateString()}
                </Text>
                {item.note ? <Text style={styles.historyNote}>{item.note}</Text> : null}
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#666", marginTop: 12, textAlign: "center" }}>
                No history items yet.
              </Text>
            }
          />
        )}
      </View>

      <View>
        {/* Bottom navigation bar */}
        {user && <NavigationBar user={user} />}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

