import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const SearchIcon = ({ size = 16, color = "#D9D9D9" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.40049 7.52622C1.40049 4.12623 4.21809 1.36999 7.69378 1.36999C11.1695 1.36999 13.9871 4.12623 13.9871 7.52622C13.9871 10.9262 11.1695 13.6825 7.69378 13.6825C4.21809 13.6825 1.40049 10.9262 1.40049 7.52622ZM7.69378 0C3.44462 0 0 3.3696 0 7.52622C0 11.6828 3.44462 15.0524 7.69378 15.0524C9.47361 15.0524 11.1123 14.4612 12.4158 13.4686L14.8053 15.8C15.0791 16.0672 15.5224 16.0666 15.7955 15.7987C16.0687 15.5309 16.0681 15.0972 15.7943 14.83L13.4391 12.5321C14.6511 11.202 15.3876 9.44823 15.3876 7.52622C15.3876 3.3696 11.9429 0 7.69378 0Z"
      fill={color}
    />
  </Svg>
);

export default function Fields() {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState("Some text");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fields</Text>
      <Text style={styles.subtitle}>4 types of fields with 6 states</Text>

      {/* Default */}
      <TextInput
        style={styles.default}
        placeholder="Default"
        placeholderTextColor="#C1C1C1"
      />

      {/* Focus */}
      <TextInput
        style={[styles.input, focused && styles.focus]}
        placeholder="Focus"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Filled */}
      <TextInput
        style={styles.input}
        value={filled}
        onChangeText={setFilled}
      />

      {/* Disabled */}
      <TextInput
        style={[styles.input, styles.disabled]}
        placeholder="Disabled"
        editable={false}
      />

      {/* With icon */}
      <View style={styles.withIcon}>
        <SearchIcon />
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search recipes"
          placeholderTextColor="#C1C1C1"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#303030",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#787A7C",
    marginBottom: 20,
  },
  default: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C1C1C1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  focus: {
    borderColor: "#E23E3E",
  },
  disabled: {
    backgroundColor: "#F1F1F1",
    color: "#C1C1C1",
  },
  withIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C1C1C1",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
