// import { useAuthStore } from "@/components/Store/authStore";
import Button from "@/components/ui/button";
import NavigationBar from "@/components/ui/figma_navbar";
import { useUser } from "@/components/userContext";
import { colors, fonts, spacing, profilePageStyles as styles } from "@/theme";
import { RecipeBox, User, UserRecipeHistory } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../../Search";

export default function ProfilePage() {
  // const { accessToken } = useAuthStore();
  const userObject = useUser();
  const [user, setUser] = useState<User | null>(null);
  const accessToken = userObject.user?.token;
  const [recipes, setRecipes] = useState<RecipeBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<UserRecipeHistory[]>([]);

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
      const response = await fetch(`${API_BASE_URL}api/UserRecipeHistory`,
        {
          headers: {
            Authorization: `Bearer ${userObject.user?.token}`,
          },
        });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: UserRecipeHistory[] = await response.json();
      setHistory(res);

      // Fetch recipe details for each recipeId
      const recipePromises = res.map(async (h) => {
        const r = await fetch(`${API_BASE_URL}api/Recipes/recipe/detail/${h.recipeId}`);
        return await r.json();
      });

      const recipeResults = await Promise.all(recipePromises);
      setRecipes(recipeResults);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
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
      <View>
        <Text style={{ fontSize: 30, fontFamily: fonts.semiBold, color: colors.textDark, marginBottom: spacing.sm, textAlign: "center" }}>RECENT RECIPES</Text>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.recipeId.toString()}
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
      </View>
      <View>
        {/* Bottom navigation bar */}
        {user && <NavigationBar user={user} />}
      </View>
    </SafeAreaView>
  );
}

