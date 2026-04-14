import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, Image, ScrollView, Text, View } from "react-native";
import { homeStyles as styles } from "../../theme";
import { RecipeBox, RecipePagination } from "../../types";

const screenWidth = Dimensions.get("window").width;
const spacing = 10;
const itemWidth = screenWidth / 3 - spacing;

type Creator = { name: string; image: any };
type Recipe = { title: string; author: string; image: any; time?: string };

const creators: Creator[] = [
  { name: "Troyan Smith", image: require("@/assets/images/figma_images/Unsplashwnolnjo7ts8.png") },
  { name: "James Wolden", image: require("@/assets/images/figma_images/Unsplashgewnwhggxls.png") },
  { name: "Niki Samantha", image: require("@/assets/images/figma_images/Unsplashij24uq1smwm.png") },
  { name: "Roberta Anny", image: require("@/assets/images/figma_images/Unsplashsfdbi7p47xe.png") },
];

const recentRecipes: Recipe[] = [
  { title: "Indonesian chicken burger", author: "Adrianna Curl", image: require("@/assets/images/figma_images/Image7.png") },
  { title: "Home made cute pancake", author: "James Wolden", image: require("@/assets/images/figma_images/Image9.png") },
  { title: "Seafood fried rice", author: "Roberta Anny", image: require("@/assets/images/figma_images/Image10.png") },
];

const trendingRecipes: Recipe[] = [
  { title: "How to make sushi at home", author: "Niki Samantha", image: require("@/assets/images/figma_images/Image4.png") },
  { title: "How to make sandwich", author: "Troyan Smith", image: require("@/assets/images/figma_images/Image6.png") },
];

function CreatorCard({ name, image }: Creator) {
  return (
    <View style={styles.creator}>
      <Image source={image} style={styles.avatar} />
      <Text style={styles.creatorName}>{name}</Text>
    </View>
  );
}

function RecipeCard({ name, addedBy, rating, imageDirectory }: RecipeBox) {
  return (
    <View style={styles.recipeCard}>
      <Image
        source={imageDirectory ? { uri: imageDirectory } : undefined}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{name}</Text>
      <Text style={styles.recipeAuthor}>By {addedBy}</Text>
      {rating && <Text style={styles.recipeTime}>star: {rating}</Text>}
    </View>
  );
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<RecipeBox[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async (pageToLoad: number) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://10.0.2.2:5103/api/Recipes/home?page=${pageToLoad}&pageSize=15`
      );

      const res: RecipePagination = await response.json();

      setData(prev => {
        const newItems = res.recipeList.filter(
          item => !prev.some(p => p.recipeId === item.recipeId)
        );
        return [...prev, ...newItems];
      }); // 🔥 append
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
      {/* Popular creators */}
      <View style={styles.section}>
        <Link push style={styles.link} href="/login">
          Login
        </Link>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular creators</Text>
          <Text style={styles.link}>See all</Text>
        </View>
        <View style={styles.creatorRow}>
          {creators.map((c) => (
            <CreatorCard key={c.name} {...c} />
          ))}
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

          // ✅ SNAP PER ITEM
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

            // ✅ Correct index calculation (includes spacing)
            const currentIndex = Math.floor(offsetX / (itemWidth + spacing));

            // 🔥 Trigger when near end
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

          // ✅ SNAP PER ITEM
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

            // ✅ Correct index calculation (includes spacing)
            const currentIndex = Math.floor(offsetX / (itemWidth + spacing));

            // 🔥 Trigger when near end
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

      {/* Hero tagline */}
      <View style={styles.section}>
        <Text style={styles.heroText}>Find best recipes for cooking</Text>
        <Link push style={styles.link} href="/login">
          Login
        </Link>
      </View>
    </ScrollView>
  );
}
