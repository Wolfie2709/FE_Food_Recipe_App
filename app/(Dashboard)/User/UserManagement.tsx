import OverlayMenu from "@/components/ui/overlay-menu";
import { useUser } from "@/components/userContext";
import { ManagementStyles as styles } from "@/theme";
import type { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/button";


export default function UserManagement() {
  const {user} = useUser();
  const [userInfo, setUserInfo] = useState<User[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
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

  const searchUsers = async () => {
    try {
      const keyword = searchText.trim();

      if (!keyword) {
        await loadUsers();
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}api/Users/users/pagination?username=${encodeURIComponent(keyword)}&page=1&pageSize=10`,
        {
          headers: {
            "Authorization": user?.token ? `Bearer ${user.token}` : "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to search users:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setUserInfo(data.userList || []);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const sortUsersByIdAsc = () => {
    setUserInfo((prev) => [...prev].sort((a, b) => a.id - b.id));
  };

  const DeleteUsers = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/Users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": user?.token ? `Bearer ${user.token}` : "" },
      });
      if (res.ok) {
        console.log("Deleted successfully");
        await loadUsers();
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <View style={styles.tableRow}>

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
    {/* Three-dot icon */}
    <TouchableOpacity
    style={{marginRight: -1}}
      onPress={() =>
        setMenuVisibleId(menuVisibleId === item.id ? null : item.id)
      }
    >
      <Image source={require("assets/images/Union.png")} />
    </TouchableOpacity>
    </View>
);

  const URL = React.useMemo(() => API_BASE_URL.slice(0, -1), []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchText}
          placeholder="Search users..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchUsers}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={searchUsers} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={require("assets/images/Search.png")} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Search + Add New User buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title="Filter" onPress={sortUsersByIdAsc} />
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

      {/* Overlay menu */}
      <OverlayMenu
        visible={!!menuVisibleId}
        onClose={() => setMenuVisibleId(null)}
        items={
          menuVisibleId
            ? [
                {
                  label: "Edit",
                  onPress: () =>
                    router.push({
                      pathname: "./EditUsers",
                      params: { usersId: menuVisibleId.toString() },
                    }),
                },
                {
                  label: "Hard Delete",
                  onPress: () => DeleteUsers(menuVisibleId),
                  destructive: true,
                },
              ]
            : []
        }
      />
    </View>
  );
}

