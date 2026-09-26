import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function GlowFeedback({ trigger, success }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger == null) return;

    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger]);

  if (trigger == null) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.glow,
        {
          backgroundColor: success ? "#00e67699" : "#ff333399",
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    zIndex: 999,
    elevation: 999,
  },
});
