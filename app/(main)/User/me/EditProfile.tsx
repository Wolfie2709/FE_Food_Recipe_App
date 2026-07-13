import { useUser } from "@/components/userContext";
import { User } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const token = user?.token;
  const contextUsername = user?.username;
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/Users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: User = await res.json();
        setProfile({
          ...data,
          username: contextUsername || data.username,
        });

        setUsername(contextUsername || data.username || "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        if (data.pictureDirectory) {
          setAvatarUri(`${API_BASE_URL}${data.pictureDirectory}`);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        Alert.alert("Error", "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, contextUsername]);

  useEffect(() => {
    if (!contextUsername) return;
    setUsername(contextUsername);
  }, [contextUsername]);

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };
  const parseResponse = async (res: Response) => {
    const raw = await res.text();
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  };
  

  // Save profile info
  // Save profile info
const saveProfileInfo = async () => {
  const res = await fetch(`${API_BASE_URL}api/Users/edit/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      phoneNumber,
      email,
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await parseResponse(res);
};

// Save avatar
const saveAvatar = async () => {
  if (!avatarUri || avatarUri.startsWith("http")) return null;

  const formData = new FormData();
  const filename = avatarUri.split("/").pop()!;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append("file", {
    uri: avatarUri,
    name: filename,
    type,
  } as any);

  const res = await fetch(`${API_BASE_URL}api/Users/avatar/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await parseResponse(res);
};


  // Save all
  const handleSaveAll = async () => {
    try {
      const updatedProfile = await saveProfileInfo();
      const updatedAvatar = await saveAvatar();

      const responseUsername =
        typeof updatedProfile === "object" && updatedProfile !== null && "username" in updatedProfile
          ? String((updatedProfile as any).username || "")
          : "";
      const nextUsername = responseUsername || username;

      if (user) {
        await setUser({
          ...user,
          username: nextUsername,
        });
      }
  
      // If backend returned JSON user object, update state
      if (typeof updatedProfile === "object") setProfile(updatedProfile);
      else if (typeof updatedAvatar === "object") setProfile(updatedAvatar);
  
      Alert.alert("Success", "Profile updated successfully!");
      console.log("Profile response:", updatedProfile);
      console.log("Avatar response:", updatedAvatar);
      router.push("/(main)/User/me/profilePage");
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Error", "Could not update profile.");
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.label}>No avatar</Text>
          </View>
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.link}>Choose Image</Text>
        </TouchableOpacity>
      </View>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      {/* First Name */}
      <Text style={styles.label}>First name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      {/* Last Name */}
      <Text style={styles.label}>Last name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Phone Number */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAll}>
        <Text style={styles.saveButtonText}>Save All</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  header: { paddingVertical: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#303030" },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 16, color: "#303030", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  saveButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  link: { color: "#E23E3E", marginTop: 8 },
});
