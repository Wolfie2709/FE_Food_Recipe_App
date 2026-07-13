import OverlayMenu from "@/components/ui/overlay-menu";
import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { Review } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";

export default function ReviewManagement() {
  const {user} = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const loadReviews = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/Reviews/review/pagination?page=1&pageSize=100`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to load reviews:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setReviews(data.reviewList || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const searchReviews = async () => {
    try {
      const keyword = searchText.trim();

      if (!keyword) {
        await loadReviews();
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}api/Reviews/review/pagination?reviewContent=${encodeURIComponent(keyword)}&page=1&pageSize=100`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to search reviews:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setReviews(data.reviewList || []);
    } catch (error) {
      console.error("Error searching reviews:", error);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Authorization": user?.token ? `Bearer ${user.token}` : "" },
      });
      if (res.ok) {
        console.log("Deleted successfully");
        await loadReviews();
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const getReviewId = (item: Review): number | null => {
    const runtimeReview = item as Review & { reviewId?: number; id?: number };
    if (typeof runtimeReview.reviewId === "number") return runtimeReview.reviewId;
    if (typeof runtimeReview.id === "number") return runtimeReview.id;
    return null;
  };

  const renderItem: ListRenderItem<Review> = ({ item }) => (
    <View style={styles.tableRow}>

    <View style={styles.tableCellId}>
      <Text style={styles.tableCellText}>{getReviewId(item) ?? "-"}</Text>
    </View>

    <View style={styles.tableCellProduct}>
      <View style={styles.ProductCell}>
        <View>
          <Image
            source={require("assets/images/icon.png")}
            style={styles.ImageContent}
            resizeMode="cover"
          />
        </View>

        <View style={styles.ProductInformation}>
          <Text style={styles.tableCellText}>
            {item.content || "Untitled"}
          </Text>
        </View>
      </View>
    </View>
    {/* Three-dot icon */}
    <TouchableOpacity
    style={{marginRight: -1}}
      onPress={() => {
        const id = getReviewId(item);
        if (id === null) return;
        setMenuVisibleId(menuVisibleId === id ? null : id);
      }}
    >
      <Image source={require("assets/images/Union.png")} />
    </TouchableOpacity>
    </View>
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchText}
          placeholder="Search reviews..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchReviews}
          returnKeyType="search"
        />
        <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
      </View>

      {/* Search button */}
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Button title="Search" onPress={searchReviews} />
      </View>

      {/* Table */}
      <View style={styles.boxListTable}>
        {/* Table header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderTextId}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>ID</Text>
            </View>
          </View>
          <View style={styles.tableHeaderTextProducts}>
            <View style={styles.TabHeaderInner}>
              <Text style={styles.tableHeaderText}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Review list */}
        <FlatList
          data={reviews}
          style={{ flex: 1 }}
          keyExtractor={(item, index) => {
            const id = getReviewId(item);
            return id !== null ? id.toString() : `${item.recipeId}-${index}`;
          }}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>

      {/* Overlay menu */}
      <OverlayMenu
        visible={!!menuVisibleId}
        onClose={() => setMenuVisibleId(null)}
        items={
          menuVisibleId
            ? [
                {
                  label: "Delete",
                  onPress: () => deleteReview(menuVisibleId),
                  destructive: true,
                },
              ]
            : []
        }
      />
    </View>
  );
}

