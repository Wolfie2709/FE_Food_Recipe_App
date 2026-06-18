import { useUser } from "@/components/userContext";
import { RecipeStepStyles as styles } from "@/theme";
import { RecipeStepInfo } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, Text, View } from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";

type EditRecipeStepFormProps = {
  recipeId: string;
};

export default function EditCookingSteps({ recipeId }: EditRecipeStepFormProps) {
  const { user } = useUser();
  const [recipeSteps, setRecipeSteps] = useState<RecipeStepInfo[]>([]);
  const [name, setName] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const router = useRouter();

  // Load existing steps
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-${recipeId}`, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
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
      updated[index].pictureDirectory = result.assets[0].uri;
      setRecipeSteps(updated);
    }
  };

  const extractStepIdFromResponse = async (res: Response) => {
    const responseText = await res.text().catch(() => "");
    if (!responseText) return null;

    try {
      const parsed = JSON.parse(responseText);
      return parsed?.recipeStepId || parsed?.id || null;
    } catch {
      const digits = responseText.match(/(\d+)/);
      if (!digits) return null;
      const id = Number(digits[0]);
      return Number.isNaN(id) ? null : id;
    }
  };

  const uploadStepImage = async (stepId: number, imageUri: string) => {
    const formData = new FormData();
    if (Platform.OS === "web") {
      const imageResponse = await fetch(imageUri);
      const blob = await imageResponse.blob();
      const file = new File([blob], `recipe-step-${stepId}-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      formData.append("file", file);
    } else {
      formData.append("file", {
        uri: imageUri,
        name: `recipe-step-${stepId}-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
    }

    const imageResponse = await fetch(
      `${API_BASE_URL}api/RecipeSteps/update/image/recipe-step/${stepId}`,
      {
        method: "PUT",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: formData,
      }
    );

    if (!imageResponse.ok) {
      console.error("Failed to upload step image:", await imageResponse.text());
    }
  };

  // Add new step row
  const addStep = () => {
    if (!currentDescription.trim()) return;
    setRecipeSteps([
      ...recipeSteps,
      {
        recipeStepId: null,
        name: name.trim() || currentDescription,
        description: currentDescription,
      },
    ]);
    setName("");
    setCurrentDescription("");
  };

  // Save steps (PUT for existing, POST for new)
  const saveSteps = async () => {
    try {
      for (const step of recipeSteps) {
        const payload = {
          name: step.name,
          description: step.description,
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
          continue;
        }

        const isLocalImage =
          (step.pictureDirectory || step.imageUrl) &&
          !(step.pictureDirectory || step.imageUrl || "").startsWith("http") &&
          !(step.pictureDirectory || step.imageUrl || "").startsWith("/Pictures");

        if (isLocalImage) {
          const targetStepId = isExisting
            ? Number(step.recipeStepId)
            : await extractStepIdFromResponse(res);

          if (targetStepId) {
            await uploadStepImage(targetStepId, (step.pictureDirectory || step.imageUrl)!);
          }
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

      <Field
        placeholder="Instruction Name"
        value={name}
        keyboardType="default"
        onChangeText={setName}
        maxLength={100}
      />

      <Field
        placeholder="Instruction description"
        value={currentDescription}
        keyboardType="default"
        onChangeText={setCurrentDescription}
        maxLength={100}
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
