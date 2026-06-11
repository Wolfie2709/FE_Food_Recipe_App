import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<string[]>([]);

  // Load notifications from storage
  useEffect(() => {
    const loadNotifications = async () => {
      const stored = await AsyncStorage.getItem("notifications");
      if (stored) setNotifications(JSON.parse(stored));
    };
    loadNotifications();
  }, []);

  // Add a test notification (for demo purposes)
  const addNotification = async (message: string) => {
    const updated = [message, ...notifications];
    setNotifications(updated);
    await AsyncStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationBox}>
            <Text style={styles.notificationText}>{item}</Text>
          </View>
        )}
      />

      {/* Demo button to add a notification */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addNotification("New recipe added!")}
      >
        <Text style={styles.addButtonText}>Add Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  notificationBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  notificationText: { fontSize: 16, color: "#333" },
  addButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
