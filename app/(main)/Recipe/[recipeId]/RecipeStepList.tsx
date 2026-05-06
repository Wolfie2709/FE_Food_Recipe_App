import { RecipeStepListStyles as styles } from "@/theme";
import { RecipeDetailStepListDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeStepList() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [steps, setSteps] = useState<RecipeDetailStepListDto[]>([]);
  const [loading, setLoading] = useState(true);

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}api/RecipeSteps/recipe-${recipeId}`
        );
  
        if (!res.ok) {
          console.error("Failed to fetch steps:", res.status);
          setSteps([]);
          return;
        }
  
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        console.log("Fetched steps:", data);
        setSteps(data);
      } catch (err) {
        console.error("Error loading steps:", err);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSteps();
  }, [recipeId]);
  
  if (loading) return <Text>Loading steps...</Text>;
  if (!steps.length) return <Text>No steps found for this recipe.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.recipeStepId}
            style={styles.infoBox}
            onPress={() =>
              router.push({
                pathname: "/(main)/Recipe/[recipeId]/RecipeStepDetail",
                params: { id: step.recipeStepId.toString(), recipeId },
              })
            }
          >
            {/* Circle thumbnail */}
            {step.imageUrl ? (
              <Image
                source={{ uri: `${URL}${step.imageUrl}` }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={styles.thumbnailPlaceholder} />
            )}

            <Text style={styles.stepTitle}>
              Step {index + 1}: {step.name}
            </Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish this recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
