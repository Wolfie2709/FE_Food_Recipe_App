import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";


export default function IngredientsManagement() {
  const {user} = useUser();
  const [userInfo, setUserInfo] = useState<User[]>([]);
  const router = useRouter();

  // Load all recipes
  const loadUsers = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}api/Users/users/pagination?page=1&pageSize=10`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to load users:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setUserInfo(data.userList);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() =>
        router.push({
          pathname: "/Recipe/add-recipe/AddNewRecipe",
          params: { ingredientsId: item.id.toString() },
        })
      }
    >
      <View style={styles.tableCellId}>
        <Text style={styles.tableCellText}>{item.id}</Text>
      </View>

      <View style={styles.tableCellProduct}>
        <View style={styles.ProductCell}>
          <View>
            <Image
              source={
                item.pictureId
                  ? { uri: `${URL}${item.pictureId}` }
                  : require("assets/images/icon.png")
              }
              style={styles.ImageContent}
              resizeMode="cover"
            />
          </View>

          <View style={styles.ProductInformation}>
            <Text style={styles.tableCellText}>
              {item.username || "Untitled"}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Image source={require("assets/images/Union.png")} />
      </View>
    </TouchableOpacity>
  );

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchText} placeholder="Search recipes..." />
        <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
      </View>

      {/* Filter + Add New Recipe buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={() => { }} />
        <Button title="Add New User" onPress={() => router.push("./AddNewEmployee")} />
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
              <Text style={styles.tableHeaderText}>Users</Text>
            </View>
          </View>
        </View>

        {/* Recipe list */}
        <FlatList
          data={userInfo}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.id.toString()}
          // style={styles.boxList}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

