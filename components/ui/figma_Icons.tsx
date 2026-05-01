import React from "react";
import Svg, { Path } from "react-native-svg";

// Bookmark
export const BookmarkIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={(size * 19) / 15} viewBox="0 0 15 19" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.47024 0C1.08324 0 0.00424319 0.932 0.00424319 8.429C0.00424319 16.822 -0.152757 19 1.44324 19C3.03824 19 5.64324 15.316 7.47024 15.316C9.29724 15.316 11.9022 19 13.4972 19C15.0932 19 14.9362 16.822 14.9362 8.429C14.9362 0.932 13.8572 0 7.47024 0Z"
      fill={color}
    />
  </Svg>
);

// Chat Bubble
export const ChatIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={(size * 21) / 17} viewBox="0 0 17 21" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.20892 0.277995C5.28836 0.0570838 6.619 0 8.22037 0C9.82174 0 11.1524 0.0570838 12.2318 0.277995C13.3248 0.501682 14.2256 0.906083 14.9024 1.64749C15.5712 2.38015 15.9433 3.35742 16.1566 4.56915C16.3695 5.77872 16.4364 7.29736 16.4364 9.179..."
      fill={color}
    />
  </Svg>
);

// Minus
export const MinusIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={(size * 2) / 9} viewBox="0 0 9 2" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0.75C0 0.335786 0.335786 0 0.75 0H7.605C8.01921 0 8.355 0.335786 8.355 0.75C8.355 1.16421 8.01921 1.5 7.605 1.5H0.75C0.335786 1.5 0 1.16421 0 0.75Z"
      fill={color}
    />
  </Svg>
);

// Play
export const PlayIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M9 0C13.977 0 18 4.032 18 9C18 13.977 13.977 18 9 18C4.032 18 0 13.977 0 9C0 4.032 4.032 0 9 0ZM8.685 4.437C8.316 4.437 8.01 4.734 8.01 5.112V9.657C8.01 9.891 8.136 10.107 8.343 10.233L11.871 12.339..."
      fill={color}
    />
  </Svg>
);

// Star
export const StarIcon = ({ size = 24, color = "#FFB661" }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path
      d="M9.55008 7.46476C9.3947 7.62328 9.32331 7.85253 9.3587 8.07736L9.89203 11.1845C9.93703 11.4479 9.83144 11.7144 9.62207 11.8666..."
      fill={color}
    />
  </Svg>
);

// Search
export const SearchIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.68059 9.03146C1.68059 4.95147 5.06171 1.64398 9.23254 1.64398C13.4034 1.64398 16.7845 4.95147 16.7845 9.03146..."
      fill={color}
    />
  </Svg>
);

// Heart
export const HeartIcon = ({ size = 24, color = "#F9D8D8" }) => (
  <Svg width={size} height={(size * 16) / 15} viewBox="0 0 15 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.38164 0C2.94735 0 1.02069 4.01524 1.02069 6.66952C1.02069 8.65333 1.3083 8.06952 0.21021 10.4895..."
      fill={color}
    />
  </Svg>
);

// User
export const UserIcon = ({ size = 24, color = "#303030" }) => (
  <Svg width={size} height={(size * 18) / 15} viewBox="0 0 15 18" fill="none">
    <Path
      d="M1.93892 0.328069C2.36506 0.109357 2.8125 0 3.28125 0C3.77131 0.0218712 4.6875 0.352127 5.04972 0.503038..."
      fill={color}
    />
  </Svg>
);

// Shield
export const ShieldIcon = ({ size = 24, color = "#F9D8D8" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 11.713C0 6.082 0.614 6.475 3.919 3.41C5.365 2.246 7.615 0 9.558 0C11.5 0 13.795 2.235 15.254 3.41..."
      fill={color}
    />
  </Svg>
);
