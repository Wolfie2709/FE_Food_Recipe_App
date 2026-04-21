import { uiKitsStyles as styles, colors as stylesColors } from "@/theme";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

export default function UiKits() {
  return (
    <View style={styles.container}>
      {/* Status Bar Example */}
      <View style={styles.statusBarWrapper}>
        <Svg width={375} height={34} viewBox="0 0 375 34">
          <Rect x={120} y={21} width={135} height={5} rx={2.5} fill={stylesColors.dark} />
        </Svg>
        <Svg width={375} height={34} viewBox="0 0 375 34">
          <Rect x={120} y={21} width={135} height={5} rx={2.5} fill={stylesColors.light} />
        </Svg>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Status Bar</Text>

      {/* Fields Section */}
      <View style={styles.fieldsSection}>
        <Text style={styles.fieldsTitle}>Fields</Text>
        <Text style={styles.fieldsSubtitle}>4 type of fields with 6 states</Text>
        <Svg width={360} height={1} viewBox="0 0 360 1">
          <Path d="M0 0H360" stroke="white" />
        </Svg>
      </View>
    </View>
  );
}