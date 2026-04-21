import { iconStyles as styles } from "@/theme";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Icons() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Icons</Text>
        <Text style={styles.headerSubtitle}>UI icon components</Text>
        <Svg width={360} height={1} viewBox="0 0 360 1">
          <Path d="M0 0H360" stroke="white" />
        </Svg>
      </View>

      {/* Example Icon Row */}
      <View style={styles.iconRow}>
        {/* Example: Location Pin */}
        <View style={styles.iconWrapper}>
          <Svg width={18} height={18} viewBox="0 0 18 18">
            <Path
              d="M9 0C13.977 0 18 4.032 18 9C18 13.977 13.977 18 9 18C4.032 18 0 13.977 0 9C0 4.032 4.032 0 9 0ZM8.685 4.437C8.316 4.437 8.01 4.734 8.01 5.112V9.657C8.01 9.891 8.136 10.107 8.343 10.233L11.871 12.339C11.979 12.402 12.096 12.438 12.222 12.438C12.447 12.438 12.672 12.321 12.798 12.105C12.987 11.79 12.888 11.376 12.564 11.178L9.36 9.27V5.112C9.36 4.734 9.054 4.437 8.685 4.437Z"
              fill="#303030"
            />
          </Svg>
        </View>

        {/* Example: Search Icon */}
        <View style={styles.iconWrapper}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.23254 0C4.13355 0 0 4.04352 0 9.03146C0 14.0194 4.13355 18.0629 9.23254 18.0629C11.3683 18.0629 13.3347 17.3535 14.8989 16.1624L17.7663 18.96C18.0949 19.2806 18.6269 19.2799 18.9547 18.9585C19.2824 18.6371 19.2817 18.1166 18.9531 17.796L16.1269 15.0385C17.5813 13.4424 18.4651 11.3379 18.4651 9.03146C18.4651 4.04352 14.3315 0 9.23254 0Z"
              fill="#303030"
            />
          </Svg>
        </View>
      </View>

      {/* Section Labels */}
      <View style={styles.sectionLabels}>
        <Text style={styles.sectionLabel}>Menu</Text>
        <Text style={styles.sectionLabel}>General</Text>
      </View>
    </View>
  );
}

