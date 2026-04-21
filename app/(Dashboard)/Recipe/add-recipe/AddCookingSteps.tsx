import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";

type Step = {
  description: string;
  imageUri?: string;
};

type Props = {
  recipeId: string; // pass this in via navigation params
};

export default function AddCookingSteps({ recipeId }: Props) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentDescription, setCurrentDescription] = useState("");

  // Pick image for a step
  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const updated = [...steps];
      updated[index].imageUri = result.assets[0].uri;
      setSteps(updated);
    }
  };

  // Add new step row
  const addStep = () => {
    if (!currentDescription.trim()) return;
    setSteps([...steps, { description: currentDescription }]);
    setCurrentDescription("");
  };

  // Save all steps to API
  const saveSteps = async () => {
    try {
      for (const step of steps) {
        const payload = {
          description: step.description,
          imageUrl: step.imageUri || null,
        };
        const res = await fetch(
          `http://192.168.1.108:5103/api/RecipeSteps/create-step-for-${recipeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          console.error("Failed to save step:", res.status, res.statusText);
        }
      }
      console.log("All steps saved!");
    } catch (err) {
      console.error("Error saving steps:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Recipe</Text>
      <Text style={styles.sectionTitle}>Steps</Text>

      {/* Input for new step */}
      <TextInput
        style={styles.input}
        placeholder="Instruction description"
        value={currentDescription}
        onChangeText={setCurrentDescription}
      />
      <Button title="Add new step" onPress={addStep} />

      {/* List of steps */}
      <FlatList
        data={steps}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>{item.description}</Text>
            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.stepImage} />}
            <Button title="Add picture" onPress={() => pickImage(index)} />
          </View>
        )}
      />

      {/* Save buttons */}
      <Button title="Save cooking steps" onPress={saveSteps} color="#E23E3E" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  stepRow: { marginVertical: 10 },
  stepText: { fontSize: 14, marginBottom: 6 },
  stepImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 6 },
});
