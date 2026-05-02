import { nBarStyles as styles } from "@/theme";
import { User } from "@/types";
import { useRouter } from "expo-router"; // or useNavigation from react-navigation
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// Icons
const HomeIcon = ({ size = 40, color = "#E23E3E" }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M0 20C0 8.95 8.95 0 20 0s20 8.95 20 20-8.95 20-20 20S0 31.05 0 20Z" fill={color} />
  </Svg>
);

const ShieldIcon = ({ size = 24, color = "#F9D8D8" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 11.713C0 6.082 0.614 6.475 3.919 3.41C5.365 2.246 7.615 0 9.558 0C11.5 0 13.795 2.235 15.254 3.41C18.559 6.475 19.172 6.082 19.172 11.713C19.172 20 17.213 20 9.586 20C1.959 20 0 20 0 11.713Z"
      fill={color}
    />
  </Svg>
);

const CircleIcon = ({ size = 48, color = "#E23E3E" }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z" fill={color} />
  </Svg>
);

// New Profile Icon
const ProfileIcon = ({ size = 28, color = "#303030" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z"
      fill={color}
    />
  </Svg>
);

export default function NavigationBar({ user }: { user?: Partial<User> }) {
  const router = useRouter();


  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
          <HomeIcon />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navItem} onPress={() => router.push("/shield")}>
          <ShieldIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/circle")}>
          <CircleIcon />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/User/me/profilePage")}
        >
          <ProfileIcon />
        </TouchableOpacity>

      </View>
    </View>
  );
}


