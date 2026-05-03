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

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-${recipeId}`);
        const data = await res.json();
        setSteps(data);
      } catch (err) {
        console.error("Failed to load steps:", err);
      }
    };
    fetchSteps();
  }, [recipeId]);

  if (!steps.length) return <Text>Loading steps...</Text>;

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
                params: { id: step.recipeStepId.toString() },
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

            <Text style={styles.stepTitle}>Step {index + 1}: {step.name}</Text>
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

