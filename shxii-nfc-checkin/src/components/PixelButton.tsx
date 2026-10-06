import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SwampColors } from "../constants/theme";

type PixelButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "danger";
  style?: StyleProp<ViewStyle>;
};

export default function PixelButton({
  title,
  onPress,
  disabled = false,
  tone = "primary",
  style,
}: PixelButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tones[tone].button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, tones[tone].label]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  primary: {
    backgroundColor: SwampColors.moss,
    borderColor: SwampColors.backgroundDeep,
  },
  primaryLabel: { color: SwampColors.backgroundDeep },
  secondary: {
    backgroundColor: SwampColors.panelRaised,
    borderColor: SwampColors.border,
  },
  secondaryLabel: { color: SwampColors.text },
  danger: {
    backgroundColor: SwampColors.danger,
    borderColor: SwampColors.backgroundDeep,
  },
  dangerLabel: { color: SwampColors.backgroundDeep },
  disabled: { opacity: 0.42 },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 3 },
});

const tones = {
  primary: { button: styles.primary, label: styles.primaryLabel },
  secondary: { button: styles.secondary, label: styles.secondaryLabel },
  danger: { button: styles.danger, label: styles.dangerLabel },
} as const;
