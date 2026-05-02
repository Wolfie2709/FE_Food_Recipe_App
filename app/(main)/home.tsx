import NavigationBar from "@/components/ui/figma_navbar";
import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles as styles } from "../../theme";
import { RecipeBox, RecipePagination } from "../../types";

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

function RecipeCard({ name, addedBy, rating, imageDirectory }: RecipeBox) {
  let URL = API_BASE_URL.slice(0, -1);
  return (
    <View style={styles.recipeCard}>
      <Image
        source={imageDirectory ? { uri: `${URL}${imageDirectory}` } : undefined}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{name}</Text>
      <Text style={styles.recipeAuthor}>By {addedBy}</Text>
      {rating && <Text style={styles.recipeTime}>star: {rating}</Text>}
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

  return (
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

      {/* Recent recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent recipes</Text>
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
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(main)/Recipe/[recipeId]/RecipeDetail",
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

      {/* Search bar */}
      <View style={styles.section}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search recipes</Text>
        </View>
      </View>
      {user && <NavigationBar user={user} />}

    </ScrollView>
  );
}