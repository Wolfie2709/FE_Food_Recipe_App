import Button from "@/components/ui/button";
import { employeeFormStyles as styles } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { useUser } from "../userContext";


export default function AddNewEmployeeForm() {
    const { user } = useUser();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [sex, setSex] = useState("");
    const [role, setRole] = useState("")

    const router = useRouter();

    const AddNewEmployee = async () => {
        console.log("Register pressed");
        const payload = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            phonenumber: phonenumber.trim(),
            sex: sex.trim(),
            role: role.trim(),
        };

        console.log("Request payload:", JSON.stringify(payload));

        try {
            const response = await fetch(`${API_BASE_URL}api/Auth/register`, {
                method: "POST",
                headers: {
                    Authorization: user?.token ? `Bearer ${user.token}` : "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            // Read the body once
            const text = await response.text();

            if (!response.ok) {
                console.error("Registration failed:", text);
                Alert.alert("Registration failed", text || "Please check your details");
                return;
            }

            // Try to parse JSON if possible
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.log("Registration response (text):", text);
                Alert.alert("Registration success", text);
                router.push("./UserManagement");
                return;
            }

            console.log("Registration response:", data);

            if (data.accessToken) {
                console.log("Access token:", data.accessToken);
                // Save token in AsyncStorage or context
            }

            router.push("/(auth)/login");
        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert("Error", "Could not connect to server");
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
            <View style={styles.overlay}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your first name"
                    value={firstname}
                    onChangeText={setFirstname}
                />

                <Text style={styles.label}>Last name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your last name"
                    value={lastname}
                    onChangeText={setLastname}
                />

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Phone number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"   // shows number pad
                    value={phonenumber}
                    onChangeText={setPhonenumber}
                    maxLength={10}             // optional limit
                />

                <Text style={styles.label}>Sex</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your sex"
                    value={sex}
                    onChangeText={setSex}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Role</Text>
                <Picker
                selectedValue={role}
                onValueChange={(value) => setRole(value)}
                style={styles.picker}
                >
                <Picker.Item label="User" value="user"/>
                <Picker.Item label="Admin" value="admin"/>
                </Picker>

                <Button title="Add new employee" onPress={AddNewEmployee} />
            </View>
        </ScrollView>
    );
}

