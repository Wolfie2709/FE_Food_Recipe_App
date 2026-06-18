import { nBarStyles as styles } from "@/theme";
import { Recipe, User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router"; // or useNavigation from react-navigation
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// Icons
const HomeIcon = ({ size = 40, color = "#E23E3E" }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M0 20C0 8.95 8.95 0 20 0s20 8.95 20 20-8.95 20-20 20S0 31.05 0 20Z" fill={color} />
  </Svg>
);

const PlusIcon = ({ size = 28, color = "#E23E3E" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      fill={color}
    />
  </Svg>
);

const ShoppingCartIcon = ({ size = 28, color = "#E23E3E" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
      fill={color}
    />
  </Svg>
);

// New Profile Icon
const ProfileIcon = ({ size = 28, color = "#303030" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z"
      fill={color}
    />
  </Svg>
);

export default function NavigationBar({ user }: { user?: Partial<User> }) {
  const router = useRouter();
  
    const [recipes, setRecipes] = useState<Recipe[]>([]);
      const loadRecipes = async (): Promise<Recipe[]> => {
        try {
          const res = await fetch(
            `${API_BASE_URL}api/Recipes/home?page=1&pageSize=50`,
            {
              headers: {
                "Authorization": user?.token ? `Bearer ${user.token}` : "",
              },
            }
          );
          if (!res.ok) {
            console.error("Failed to load recipes:", res.status, res.statusText);
            return [];
          }
          const data = await res.json();
          setRecipes(data.recipeList);
          return data.recipeList || [];
        } catch (error) {
          console.error("Error loading recipes:", error);
          return [];
        }
      };
    
      useEffect(() => {
        loadRecipes();
      }, []);
 const createRecipe = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }

      const res = await fetch(`${API_BASE_URL}api/Recipes/create-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: "Untitled Recipe",
          description: null,
          cookingTime: 0,
          servingSize: 0,
        }),
      });

      const raw = await res.text();

      if (!res.ok) {
        console.error("Failed to create recipe:", res.status, res.statusText, raw);
        return;
      }

      if (raw.includes("success")) {
        console.log("Recipe created successfully");
        const updated = await loadRecipes();

        if (updated && updated.length > 0) {
          const latest = updated.reduce((max, r) => (r.recipeId > max.recipeId ? r : max), updated[0]);
          router.push({
            pathname: "../(Dashboard)/Recipe/add-recipe/AddNewRecipe",
            params: { recipeId: latest.recipeId.toString() },
          });
        }
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
          <HomeIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={createRecipe}>
          <PlusIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/ShoppingList")}>
          <ShoppingCartIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/User/me/profilePage")}
        >
          <ProfileIcon />
        </TouchableOpacity>

      </View>
    </View>
  );
}


