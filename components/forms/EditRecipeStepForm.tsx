import { useUser } from "@/components/userContext";
import { RecipeStepStyles as styles } from "@/theme";
import { RecipeStepInfo } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";

type EditRecipeStepFormProps = {
  recipeId: string;
};

export default function EditCookingSteps({ recipeId }: EditRecipeStepFormProps) {
  const { user } = useUser();
  const [recipeSteps, setRecipeSteps] = useState<RecipeStepInfo[]>([]);
  const [currentDescription, setCurrentDescription] = useState("");
  const router = useRouter();

  // Load existing steps
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-  ${recipeId}`, {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setRecipeSteps(data || []);
      } catch (err) {
        console.error("Error fetching steps:", err);
      }
    };
    fetchSteps();
  }, [recipeId]);

  // Pick image for a step
  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const updated = [...recipeSteps];
      updated[index].imageUrl = result.assets[0].uri;
      setRecipeSteps(updated);
    }
  };

  // Add new step row
 // Add new step row
const addStep = () => {
  if (!currentDescription.trim()) return;
  setRecipeSteps([
    ...recipeSteps,
    { recipeStepId: null, name: currentDescription, description: currentDescription },
  ]);
  setCurrentDescription("");
};

  // Save steps (PUT for existing, POST for new)
  const saveSteps = async () => {
    try {
      for (const step of recipeSteps) {
        const payload = {
          name: step.name,
          description: step.description,
          imageUrl: step.imageUrl || null,
        };
  
        const isExisting = step.recipeStepId && step.recipeStepId > 0; // only positive IDs are valid
        const url = isExisting
          ? `${API_BASE_URL}api/RecipeSteps/update-step-${step.recipeStepId}`
          : `${API_BASE_URL}api/RecipeSteps/create-step-for-${recipeId}`;
  
        const method = isExisting ? "PUT" : "POST";
  
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
          body: JSON.stringify(payload),
        });
  
        if (!res.ok) {
          console.error("Failed to save step:", await res.text());
        }
      }
  
      router.push({
        pathname: "../RecipeManagement",
        params: { recipeId: recipeId.toString() },
      });
    } catch (err) {
      console.error("Error saving steps:", err);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Cooking Steps</Text>
      <Text style={styles.sectionTitle}>Steps</Text>

      {/* Input for new step */}
      <Field
        placeholder="Instruction description"
        value={currentDescription}
        onChangeText={setCurrentDescription}
      />
      <Button title="Add new step" onPress={addStep} />

      {/* List of steps */}
      <FlatList
        data={recipeSteps}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>{item.description}</Text>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.stepImage} />
            )}
            <Button title="Add picture" onPress={() => pickImage(index)} />
          </View>
        )}
      />

      {/* Save button */}
      <Button title="Save cooking steps" onPress={saveSteps} />
    </View>
  );
}
