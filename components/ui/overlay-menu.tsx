import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, type TextStyle, type ViewStyle } from "react-native";
import Button from "./button";

type OverlayMenuItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type OverlayMenuProps = {
  visible: boolean;
  items: OverlayMenuItem[];
  onClose: () => void;
  style?: ViewStyle;
  menuItemStyle?: TextStyle;
  closeButtonLabel?: string;
};

export default function OverlayMenu({
  visible,
  items,
  onClose,
  style,
  menuItemStyle,
  closeButtonLabel = "Close",
}: OverlayMenuProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={[styles.overlayMenu, style]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={`${item.label}-${index}`}
            onPress={() => {
              item.onPress();
              onClose();
            }}
            style={styles.menuItemTouchable}
          >
            <Text style={[styles.menuItem, menuItemStyle, item.destructive && styles.destructiveItem]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
        <Button title={closeButtonLabel} onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  overlayMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  menuItemTouchable: {
    marginBottom: 8,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    textAlign: "center",
  },
  destructiveItem: {
    color: "#d00",
  },
});
