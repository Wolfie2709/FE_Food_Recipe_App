import { buttonStyles as styles } from "@/theme";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "text";
  size?: "large" | "small";
  disabled?: boolean;
  pressed?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "large",
  disabled = false,
  pressed = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return [
          styles.base,
          styles.secondary,
          size === "small" ? styles.small : styles.large,
          disabled && styles.disabled,
          pressed && styles.pressedSecondary,
        ];
      case "text":
        return [
          styles.base,
          styles.textButton,
          size === "small" ? styles.small : styles.large,
          disabled && styles.disabled,
          pressed && styles.pressedText,
        ];
      default: // primary
        return [
          styles.base,
          styles.primary,
          size === "small" ? styles.small : styles.large,
          disabled && styles.disabled,
          pressed && styles.pressedPrimary,
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return [styles.text, styles.secondaryText];
      case "text":
        return [styles.text, styles.textVariant];
      default:
        return [styles.text, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

