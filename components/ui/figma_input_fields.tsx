import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type FieldProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  secureTextEntry?: boolean;
};

export default function Field({
  placeholder,
  value,
  onChangeText,
  editable = true,
  secureTextEntry = true,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.base,
          focused && styles.focus,
          value ? styles.filled : null,
          !editable && styles.disabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#C1C1C1"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  base: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 12,
  },
  focus: { borderColor: "#E23E3E" },
  filled: { borderColor: "#303030" },
  disabled: { backgroundColor: "#F1F1F1", color: "#C1C1C1" },
});
