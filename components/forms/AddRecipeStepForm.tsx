import { useUser } from "@/components/userContext";
import { RecipeStepStyles as styles } from "@/theme";
import { RecipeStepInfo } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";
import Button from "../ui/button";
import Field from "../ui/figma_input_fields";

type Props = {
  recipeId: string; // pass this in via navigation params
};

export default function AddCookingSteps({ recipeId }: Props) {
  const { user } = useUser();
  const [recipeSteps, setRecipeSteps] = useState<RecipeStepInfo[]>([]);
  const [name, setName] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const router = useRouter();

  // Pick image for a step
  const pickImage = async (index: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission required", "Please allow photo library access to add an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const uri = result.assets[0].uri;
    const updated = [...recipeSteps];
    updated[index] = {
      ...updated[index],
      imageUrl: uri,
      pictureDirectory: uri,
    };
    setRecipeSteps(updated);
  };

  // Add new step row
  const addStep = () => {
    if (!currentDescription.trim()) return;
    setRecipeSteps([
      ...recipeSteps,
      {  recipeStepId: Date.now() * -1, name: name, description: currentDescription },
    ]);
    setName("");
    setCurrentDescription("");
  };

  const uploadStepImage = async (stepId: number, imageUri: string) => {
    if (!imageUri) return;

    try {
      const uri = imageUri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recipe-step.jpg",
        type: "image/jpeg",
      } as any);

      console.log("Uploading step image to:", `${API_BASE_URL}api/RecipeSteps/update/image/recipe-step/${stepId}`);

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
        const rawError = await imageResponse.text();
        console.error("Failed to upload recipe step image:", imageResponse.status, rawError);
      } else {
        console.log("✅ Recipe step image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading recipe step image:", error);
    }
  };

  const extractCreatedStepId = async (res: Response) => {
    const location = res.headers.get("location") || res.headers.get("Location");
    if (location) {
      const idMatch = location.match(/(\d+)/);
      if (idMatch) return Number(idMatch[1]);
    }

    const responseText = await res.text().catch(() => "");
    console.log("Create step response text:", responseText);

    if (responseText) {
      try {
        const createdStep = JSON.parse(responseText);
        return createdStep?.recipeStepId || createdStep?.id || null;
      } catch {
        const parsedId = Number(responseText.trim());
        if (!Number.isNaN(parsedId) && parsedId > 0) return parsedId;
        const digits = responseText.match(/(\d+)/);
        if (digits) {
          const parsedDigits = Number(digits[0]);
          if (!Number.isNaN(parsedDigits) && parsedDigits > 0) return parsedDigits;
        }
      }
    }

    return null;
  };

  const fetchRecipeStepId = async (step: RecipeStepInfo) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/RecipeSteps/recipe-${recipeId}`, {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) return null;
      const allSteps: RecipeStepInfo[] = await res.json().catch(() => []);
      const match = allSteps
        .filter((item) => item.recipeStepId && item.recipeStepId > 0)
        .find(
          (item) =>
            item.name === step.name &&
            item.description === step.description &&
            !item.imageUrl
        );
      return match?.recipeStepId || null;
    } catch (error) {
      console.error("Error fetching recipe steps for ID fallback:", error);
      return null;
    }
  };

  // Save all steps to API
  const saveSteps = async () => {
    if (!user?.token) {
      Alert.alert("Authentication required", "Please log in before saving recipe steps.");
      return;
    }

    try {
      for (const step of recipeSteps) {
        const payload = {
          name: step.name,
          description: step.description,
        };
        const res = await fetch(
          `${API_BASE_URL}api/RecipeSteps/create-step-for-${recipeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          const rawError = await res.text();
          console.error("Failed to save step:", res.status, rawError);
          continue;
        }

        let createdStepId = await extractCreatedStepId(res);

        if (!createdStepId) {
          createdStepId = await fetchRecipeStepId(step);
          if (createdStepId) {
            console.log("Found fallback created step ID:", createdStepId);
          }
        }

        const imageUri = step.imageUrl || step.pictureDirectory;
        if (createdStepId && imageUri) {
          await uploadStepImage(Number(createdStepId), imageUri);
        } else if (step.imageUrl) {
          console.warn(
            "Step image not uploaded because no created step ID was returned.",
            { createdStepId, step }
          );
        }
      }

      console.log("All steps saved!");
      router.push({
        pathname: "../RecipeManagement",
        params: { id: recipeId.toString() },
      });
    } catch (err) {
      console.error("Error saving steps:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Recipe</Text>
      <Text style={styles.sectionTitle}>Steps</Text>

      <Field
        placeholder="Instruction Name"
        value={name}
        keyboardType="default"
        onChangeText={setName}
        maxLength={100}
      />

      {/* Input for new step */}
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

      {/* Save buttons */}
      <Button
        title="Save cooking steps"
        onPress={saveSteps}
      />
    </View>
  );
}
