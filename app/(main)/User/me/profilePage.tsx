// import { useAuthStore } from "@/components/Store/authStore";
import Button from "@/components/ui/button";
import NavigationBar from "@/components/ui/figma_navbar";
import OverlayMenu from "@/components/ui/overlay-menu";
import { useUser } from "@/components/userContext";
import { profilePageStyles as styles } from "@/theme";
import { RecipeBox, User, UserRecipeHistory } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../../Search";

export default function ProfilePage() {
  // const { accessToken } = useAuthStore();
  const userObject = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "history">("recent");
  const accessToken = userObject.user?.token;
  const [loading, setLoading] = useState(true);
  const [historyRecipes, setHistoryRecipes] = useState<Array<RecipeBox & { cookedAt: string; note?: string | null }>>([]);
  const [userRecipe, setUserRecipe] = useState<RecipeBox[]>([]);
  const [menuVisibleRecipeId, setMenuVisibleRecipeId] = useState<number | null>(null);

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
      const recipeDetails = await Promise.all(
        res.map(async (item) => {
          const r = await fetch(`${API_BASE_URL}api/Recipes/recipe/detail/${item.recipeId}`);
          const data: RecipeBox = await r.json();
          return {
            ...data,
            cookedAt: item.cookedAt,
            note: item.note,
          };
        })
      );
      setHistoryRecipes(recipeDetails);
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

  type HistoryRecipe = RecipeBox & { cookedAt: string; note?: string | null };

  const handleEditRecipe = (recipeId: number) => {
    router.push({
      pathname: "/(Dashboard)/Recipe/edit-recipe/EditRecipe",
      params: { recipeId: recipeId.toString() },
    });
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userObject.user?.token}`,
        },
      });

      if (!res.ok) {
        const rawError = await res.text();
        console.error("Recipe delete failed:", res.status, rawError);
        Alert.alert("Delete failed", "Could not delete this recipe.");
        return;
      }

      setUserRecipe((prev) => prev.filter((item) => item.recipeId !== recipeId));
      setMenuVisibleRecipeId(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      Alert.alert("Delete failed", "Could not delete this recipe.");
    }
  };

  const renderRecentItem = ({ item }: { item: RecipeBox }) => (
    <View style={{ marginTop: 16, marginBottom: 16, marginLeft: 12, marginRight: 12, position: "relative" }}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "./[recipeId]/RecipeDetail",
            params: { recipeId: item.recipeId.toString() },
          })
        }
      >
        <RecipeCard {...item} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", right: 12, top: 12, padding: 8, zIndex: 2 }}
        onPress={() => setMenuVisibleRecipeId(item.recipeId)}
      >
        <Image source={require("assets/images/Union.png")} />
      </TouchableOpacity>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: HistoryRecipe }) => (
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
        <View style={styles.historyItem}>
          <Text style={styles.historyMeta}>
            Cooked at {new Date(item.cookedAt).toLocaleDateString()}
          </Text>
          {item.note ? <Text style={styles.historyNote}>{item.note}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
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
                router.push("/(Dashboard)/AdminDashboard");
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
              console.log("Edit profile button pressed");
              router.push("./EditProfile");
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
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {activeTab === "recent" ? (
        <FlatList
          data={userRecipe}
          keyExtractor={(item) => item.recipeId.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={ListHeader}
          ListHeaderComponentStyle={{ paddingBottom: 16 }}
          renderItem={renderRecentItem}
          ListEmptyComponent={
            <Text style={{ color: "#666", marginTop: 12, textAlign: "center" }}>
              No recipes yet.
            </Text>
            
          }
        />
      ) : (
        <FlatList
          data={historyRecipes}
          keyExtractor={(item) => item.recipeId.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={ListHeader}
          ListHeaderComponentStyle={{ paddingBottom: 16 }}
          renderItem={renderHistoryItem}
          ListEmptyComponent={
            <Text style={{ color: "#666", marginTop: 12, textAlign: "center" }}>
              No history items yet.
            </Text>
          }
        />
        
      )}
<View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          elevation: 9999,
        }}
      >
        {menuVisibleRecipeId !== null && (
          <OverlayMenu
            visible={true}
            onClose={() => {
              console.log("OverlayMenu onClose");
              setMenuVisibleRecipeId(null);
            }}
            items={[
              {
                label: "Edit",
                onPress: () => {
                  console.log("OverlayMenu Edit pressed", menuVisibleRecipeId);
                  handleEditRecipe(menuVisibleRecipeId!);
                },
              },
              {
                label: "Delete",
                onPress: () => {
                  console.log("OverlayMenu Delete pressed", menuVisibleRecipeId);
                  handleDeleteRecipe(menuVisibleRecipeId!);
                },
                destructive: true,
              },
            ]}
          />
        )}
      </View>

      <View>
        {/* Bottom navigation bar */}
        {user && <NavigationBar user={user} />}
      </View>
      
    </SafeAreaView>
  );
}

