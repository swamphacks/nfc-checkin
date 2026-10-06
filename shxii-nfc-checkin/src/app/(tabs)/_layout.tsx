import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { SwampColors } from "../../constants/theme";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: SwampColors.reed,
          tabBarInactiveTintColor: SwampColors.muted,
          tabBarStyle: {
            backgroundColor: SwampColors.backgroundDeep,
            borderTopColor: SwampColors.border,
            borderTopWidth: 2,
          },
          tabBarLabelStyle: { fontFamily: "monospace", fontSize: 10 },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
      </Tabs>
    </>
  );
}
