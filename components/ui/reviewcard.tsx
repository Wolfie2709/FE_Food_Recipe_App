import { Review } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type ReviewCardProps = {
  review: Review;
  avatar?: string | null;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, avatar }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("assets/images/icon.png")
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{review.username}</Text>
          <Text style={styles.date}>
            {new Date(review.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.content}>{review.content}</Text>
      <Text style={styles.like}>{review.isLiked ? "❤️ Liked" : "♡ Not liked"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    fontSize: 14,
    marginVertical: 6,
    color: "#333",
  },
  like: {
    fontSize: 12,
    color: "#e63946",
    marginTop: 4,
  },
});
