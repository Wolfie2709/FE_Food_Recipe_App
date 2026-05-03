// UserContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserLogin = { username: string; role: "user" | "admin"; token: string };

const UserContext = createContext<{
  user: UserLogin | null;
  setUser: (u: UserLogin | null) => void;
}>({ user: null, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserLogin | null>(null);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    };
    loadUser();
  }, []);

  // Save user whenever it changes
  const setUser = async (u: UserLogin | null) => {
    setUserState(u);
    if (u) {
      await AsyncStorage.setItem("user", JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
