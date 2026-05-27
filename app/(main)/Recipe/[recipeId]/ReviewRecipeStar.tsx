import Button from "@/components/ui/button";
import { ReviewStyles as styles } from "@/theme";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ReviewRecipe() {
    const {recipeId} = useLocalSearchParams();
    const router = useRouter();
  const [rating, setRating] = useState<number>(0);
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

  const submitReview = () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    console.log("Image:", image);
    router.push("../../home")
    // TODO: send to backend
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


      {/* Star Rating */}
      <Text style={styles.sectionTitle}>Rate this recipe:</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={styles.star}>{rating >= star ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>
            <View>
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
      <Text style={styles.sectionTitle}>Add a picture:</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: "#555" }}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <Button title="Submit Review" onPress={submitReview} />
      </View>
      <Button title= "Back to home" onPress={() => {
              router.push({
                pathname: "../../home",
              });
            }}/>
    </View>
  );
}

