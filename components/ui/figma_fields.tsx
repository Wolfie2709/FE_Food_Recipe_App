import { fieldStyles as styles } from "@/theme";
import React from "react";
import { Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Fields() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fields</Text>
        <Text style={styles.headerSubtitle}>4 type of fields with 6 states</Text>
        <Svg width={360} height={1} viewBox="0 0 360 1">
          <Path d="M0 0H360" stroke="white" />
        </Svg>
      </View>

      {/* Default Field */}
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.defaultField}
          placeholder="Search recipes"
          placeholderTextColor="#C1C1C1"
        />
      </View>

      {/* Focus Field */}
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.focusField}
          placeholder="Placeholder"
          placeholderTextColor="#303030"
        />
      </View>

      {/* Filled Field */}
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.filledField}
          value="Placeholder"
        />
      </View>

      {/* Filled Focus Field */}
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.filledFocusField}
          value="|"
        />
      </View>

      {/* Disabled Field */}
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.disabledField}
          placeholder="Placeholder"
          placeholderTextColor="#C1C1C1"
          editable={false}
        />
      </View>
    </View>
  );
}

