import { navBarStyles as styles } from "@/theme";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function NavigationBar() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nav Bar</Text>
        <Text style={styles.headerSubtitle}>4 type of Top Bar</Text>
        <Svg width={360} height={1} viewBox="0 0 360 1">
          <Path d="M0 0H360" stroke="white" />
        </Svg>
      </View>

      {/* Menu Label */}
      <Text style={styles.menuLabel}>Menus</Text>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        {/* Example Active Icon */}
        <View style={styles.iconWrapperActive}>
          <Svg width={40} height={40} viewBox="0 0 40 40">
            <Path
              d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
              fill="#E23E3E"
            />
          </Svg>
        </View>

        {/* Example Inactive Icons */}
        <View style={styles.iconWrapper}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 11.713C0 6.082 0.614 6.475 3.919 3.41C5.365 2.246 7.615 0 9.558 0C11.5 0 13.795 2.235 15.254 3.41C18.559 6.475 19.172 6.082 19.172 11.713C19.172 20 17.213 20 9.586 20C1.959 20 0 20 0 11.713Z"
              fill="#F9D8D8"
            />
          </Svg>
        </View>

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
    </View>
  );
}

