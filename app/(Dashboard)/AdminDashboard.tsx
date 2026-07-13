import { useUser } from "@/components/userContext";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { homeStyles as styles } from "../../theme";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
};

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export default function AdminDashboard() {
  const {user} = useUser(); 
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [ingredientsCount, setIngCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const screenWidth = Dimensions.get("window").width;
  const safeJson = async (res: Response) =>{
    const text = await res.text();
    if(!text) return;
    try{
      return JSON.parse(text);
    } catch (err){
      console.error("Json invalid", text)
      return;
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRecipe, resIng, resUser, resReview ] = await Promise.all([
          fetch(`${API_BASE_URL}api/Recipes/all`),
          fetch(`${API_BASE_URL}api/Ingredients/all`),
          fetch(`${API_BASE_URL}api/Users` ,{
            headers: {
              "Authorization": user?.token ? `Bearer ${user.token}` : "",
            },}),
          fetch(`${API_BASE_URL}api/Reviews/all`, {
            headers: {
              "Authorization": user?.token ? `Bearer ${user.token}` : "",
            },
          }),
        ]);
        const [recipes, ingredients, allUsers, reviews] = await Promise.all([
          safeJson(resRecipe),
          safeJson(resIng),
          safeJson(resUser),
          safeJson(resReview),
        ]);
        setRecipeCount( Array.isArray(recipes) ? recipes.length : 0);
        setIngCount( Array.isArray(ingredients) ? ingredients.length : 0);
        setReviewCount( Array.isArray(reviews) ? reviews.length : 0);
        setUserCount( Array.isArray(allUsers) ? allUsers.length : 0);
      } catch (err) {
        console.error("Error fetching status", err)
      }
    };

    fetchData();
  }, []);

  console.log("Recipe response:", recipeCount);
  console.log("Ingredients response:", ingredientsCount);
  console.log("Users response:", userCount);
  console.log("Reviews response:", reviewCount);
  console.log("Time of log:", new Date().toLocaleString());

  const chartValues = [recipeCount, ingredientsCount, userCount, reviewCount];
  const roundedYAxisMax = Math.max(10, Math.ceil(Math.max(...chartValues) / 10) * 10);
  const yAxisSegments = roundedYAxisMax / 10;

  const chartData = {
    labels: ["Recipes", "Ingredients", "Users", "Reviews"],
    datasets: [
      {
        data: chartValues,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Panel</Text>
        <Text style={styles.sectionSubtitle}>
          Hi admin, welcome back to your admin panel.
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.sectionRow}>
        <StatCard
          title="Recipes"
          value={recipeCount}
          subtitle={`Total recipes available`}
          color="#E94B4B"
        />
        <StatCard
          title="Ingredients"
          value={ingredientsCount}
          subtitle="12 in last 7 days"
          color="#6FEF0E"
        />
      </View>
      <View style={styles.sectionRow}>
        <StatCard
          title="Users"
          value={userCount}
          subtitle="3 in last 7 days"
          color="#A45EE2"
        />
        <StatCard
          title="Reviews"
          value={reviewCount}
          subtitle="7 in last 7 days"
          color="#C4E044"
        />
      </View>

      {/* Admin Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <Link push style={styles.link} href="./Recipe/RecipeManagement">
          Recipes
        </Link>

        <Link push style={styles.link} href="./Ingredients/IngredientsManagement">
          Ingredients
        </Link>

        <Link push style={styles.link} href="./KitchenUtensils/KitchenUtensilsManagement">
          Kitchen Utensils
        </Link>

        <Link push style={styles.link} href="./Category/CategoriesManagement">
          Categories
        </Link>

        <Link push style={styles.link} href="./User/UserManagement">
          User
        </Link>
        

      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics Chart</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" "
          fromZero
          segments={yAxisSegments}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(233, 75, 75, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
}
