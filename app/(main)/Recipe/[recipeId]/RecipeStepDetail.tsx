import { API_BASE_URL } from "@/utils/apiConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RecipeStep = {
  id: number;
  name: string;
  description: string;
  pictureDirectory?: string;
};

export default function RecipeStepDetail() {
  const { id, recipeId } = useLocalSearchParams<{ id: string; recipeId: string }>();
  const [step, setStep] = useState<RecipeStep | null>(null);

  useEffect(() => {
    const fetchStep = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-step-${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStep(data);
      } catch (err) {
        console.error("Failed to load step:", err);
        Alert.alert("Error", "Could not load step.");
      }
    };
    fetchStep();
  }, [id]);

  if (!step) return <Text>Loading step...</Text>;

  const URL = API_BASE_URL.slice(0, -1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Step number/title */}
        <Text style={styles.stepNumber}>Step {step.id}</Text>

        {/* Step image */}
        {step.pictureDirectory && (
          <Image
            source={{ uri: `${URL}${step.pictureDirectory}` }}
            style={styles.stepImage}
          />
        )}

        {/* Step description */}
        <View style={styles.infoBox}>
          <Text style={styles.stepTitle}>{step.name}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
          >
            <Text style={styles.navButtonText}>BACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              // Example: go to next step (id+1)
              const nextId = Number(id) + 1;
              router.push({
                pathname: "/(main)/Recipe/[recipeId]/RecipeStepDetail",
                params: { id: nextId.toString(), recipeId },
              });
            }}
          >
            <Text style={styles.navButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>

        {/* Finish button */}
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish this recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepNumber: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#181818" },
  stepImage: { width: "100%", height: 300, borderRadius: 8, marginBottom: 16 },
  infoBox: {
    borderWidth: 1,
    borderColor: "#E23E3E",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  stepTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#303030" },
  stepDescription: { fontSize: 16, color: "#333" },
  navRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  navButton: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  navButtonText: { fontSize: 16, fontWeight: "600", color: "#000" },
  finishButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  finishButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
