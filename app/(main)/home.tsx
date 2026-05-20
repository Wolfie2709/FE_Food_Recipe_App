import NavigationBar from "@/components/ui/figma_navbar";
import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeStyles as styles } from "../../theme";
import { RecipeBox, RecipePagination, UserRecipeHistory } from "../../types";

const screenWidth = Dimensions.get("window").width;
const spacing = 10;
const itemWidth = screenWidth / 3 - spacing;

type Creator = { name: string; image: any };

function CreatorCard({ name, image }: Creator) {
  return (
    <View style={styles.creator}>
      <Image source={image} style={styles.avatar} />
      <Text style={styles.creatorName}>{name}</Text>
    </View>
  );
}

function RecipeCard({ name, authorName, rating, imageDirectory, avatar }: RecipeBox) {
  let URL = API_BASE_URL.slice(0, -1);
  return (
    <View style={styles.recipeCard}>
      <Image
        source={imageDirectory ? { uri: `${URL}${imageDirectory}` } : undefined}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{name}</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={avatar ? { uri: `${URL}${avatar}` } : require("assets/images/icon.png")}
            style={styles.RecipeAuthorAvatar} />
          <Text style={styles.recipeAuthor}>{authorName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.recipeTime}>
            {rating ? rating : 0}
          </Text>
          <Image source={require("assets/images/Star.png")} />
        </View>
      </View>
    </View>
  );
}

export default function Home() {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<RecipeBox[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeBox[]>([]);
  const [history, setHistory] = useState<UserRecipeHistory[]>([]);
  console.log("Home sees user:", user);

  const loadData = async (pageToLoad: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}api/Recipes/home?page=${pageToLoad}&pageSize=15`
      );
      const res: RecipePagination = await response.json();

      setData(prev => {
        const newItems = res.recipeList.filter(
          item => !prev.some(p => p.recipeId === item.recipeId)
        );
        return [...prev, ...newItems];
      });
      setTotalPages(res.totalPages);

    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    }


    setIsLoading(false);
  };

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    setData([]);
    setPage(1);
    loadData(1);
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/UserRecipeHistory`,
      {
        headers: {
          "Authorization": user?.token ? `Bearer ${user.token}` : "",
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (isLoading) return <Text>Loading history...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        {/* Greeting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Welcome {user?.username ?? "Guest"}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Find best recipes for cooking
          </Text>
        </View>
        {/* Search bar */}
        <Pressable
          style={styles.section}
          onPress={() => router.push("/(main)/Search")}>
          <View style={styles.searchBar}>
            <Text style={styles.searchPlaceholder}>Search recipes</Text>
            <Image source={require("assets/images/Search.png")} />
          </View>
        </Pressable>
        {/* Popular creators */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular creators</Text>
            <Text style={styles.link}>See all</Text>
          </View>
          <View style={styles.creatorRow}>
            {/* map creators here */}
          </View>
        </View>
        {/* All recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All recipes</Text>
            <TouchableOpacity>
            <Text style={styles.link} onPress={() => {router.push({pathname: "/(main)/Recipe/AllRecipe"})}}>See all</Text>
            </TouchableOpacity>
            
          </View>
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.recipeId.toString()}
            snapToInterval={itemWidth + spacing}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: spacing }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "./Recipe/[recipeId]/RecipeDetail",
                    params: { recipeId: item.recipeId.toString() },
                  })
                }}
              >
                <View style={{ width: itemWidth }}>
                  <RecipeCard {...item} />
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: spacing }} />}
            onMomentumScrollEnd={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.floor(offsetX / (itemWidth + spacing));
              if (
                currentIndex >= data.length - 4 &&
                page < totalPages &&
                !isLoading
              ) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadData(nextPage);
              }
            }}
          />
        </View>
        {/* Recent recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent recipes</Text>
            <TouchableOpacity>
            <Text style={styles.link} onPress={() => {router.push({pathname: "/(main)/Recipe/RecipeHistory"})}}>See all</Text>
            </TouchableOpacity>
            
          </View>
          <FlatList
            data={recipes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.recipeId.toString()}
            snapToInterval={itemWidth + spacing}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: spacing }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "./Recipe/[recipeId]/RecipeDetail",
                    params: { recipeId: item.recipeId.toString() },
                  })
                }}
              >
                <View style={{ width: itemWidth }}>
                  <RecipeCard {...item} />
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: spacing }} />}
            onMomentumScrollEnd={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.floor(offsetX / (itemWidth + spacing));
              if (
                currentIndex >= data.length - 4 &&
                page < totalPages &&
                !isLoading
              ) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadData(nextPage);
              }
            }}
          />
        </View>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular categories</Text>
          <View style={styles.categoryRow}>
            {["Salad", "Breakfast", "Appetizer", "Noodle", "Lunch"].map((cat) => (
              <Text
                key={cat}
                style={[
                  styles.category,
                  cat === "Breakfast" && styles.categoryActive,
                ]}
              >
                {cat}
              </Text>
            ))}
          </View>
        </View>
        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending now 🔥</Text>
            <Text style={styles.link}>See all</Text>
          </View>
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.recipeId.toString()}
            snapToInterval={itemWidth + spacing}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: spacing }}
            renderItem={({ item }) => (
              <View style={{ width: itemWidth }}>
                <RecipeCard {...item} />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ width: spacing }} />}
            onMomentumScrollEnd={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.floor(offsetX / (itemWidth + spacing));
              if (
                currentIndex >= data.length - 4 &&
                page < totalPages &&
                !isLoading
              ) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadData(nextPage);
              }
            }}
          />
        </View>

        {user && <NavigationBar user={user} />}
      </ScrollView>
    </SafeAreaView>
  );
}