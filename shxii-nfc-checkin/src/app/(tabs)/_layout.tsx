import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Image,
} from "react-native";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorscheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFA500",
        tabBarInactiveTintColor: "#1E90FF",
        headerShown: false,
      }}
      style={styles.container}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="redeem"
        options={{
          title: "redeem",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
