import Button from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { ReviewStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ReviewRecipe() {
  const {user} = useUser();
  const { recipeId } = useLocalSearchParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitReview = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Reviews/recipe/${recipeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // assuming you have user context
        },
        body: JSON.stringify({
          content: comment,
          isLiked: isLiked === true, // true if thumbs up, false if thumbs down
        }),
      });

      if (!res.ok) {
        console.error("Failed to submit review:", res.status, await res.text());
        return;
      }

      console.log("Review submitted successfully");
      router.push("./RecipeDetail");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}
            onPress={() => {
              router.push({
                pathname: "/(main)/home",
              })
            }}
          >
            <Image source={require("assets/images/Arrow-Left.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require("assets/images/More.png")} />
          </TouchableOpacity>

          <Text style={styles.header}>Recipe Review</Text>
        </View>


      {/* Thumb Rating */}
      <Text style={styles.sectionTitle}>Do you like this recipe?</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 12 }}>
  {/* Thumbs Up */}
  <TouchableOpacity onPress={() => setIsLiked(true)} style={styles.thumbWrapper}>
    <View
      style={[
        styles.thumbCircle,
        isLiked === true && { backgroundColor: "#007BFF" }, // blue when selected
      ]}
    >
      <Text style={[styles.thumbIcon, isLiked === true && { color: "#FFF" }]}>
        👍
      </Text>
    </View>
  </TouchableOpacity>

  {/* Thumbs Down */}
  <TouchableOpacity onPress={() => setIsLiked(false)} style={styles.thumbWrapper}>
    <View
      style={[
        styles.thumbCircle,
        isLiked === false && { backgroundColor: "#FF3366" }, // red when selected
      ]}
    >
      <Text style={[styles.thumbIcon, isLiked === false && { color: "#FFF" }]}>
        👎
      </Text>
    </View>
  </TouchableOpacity>
</View>


      {/* Comment Box */}
      <Text style={styles.sectionTitle}>Leave a comment:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Write your thoughts..."
        value={comment}
        onChangeText={setComment}
      />

      {/* Image Picker */}
      {/* <Text style={styles.sectionTitle}>Add a picture:</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: "#555" }}>Tap to select an image</Text>
        )}
      </TouchableOpacity> */}

      {/* Submit Button */}
      <Button title="Submit Review" onPress={submitReview} />

      <Button
        title="Back to home"
        onPress={() =>
          router.push({
            pathname: "../../home",
          })
        }
      />
    </View>
  );
}
