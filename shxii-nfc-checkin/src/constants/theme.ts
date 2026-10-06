/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#F0F0D2",
    background: "#14251B",
    backgroundElement: "#1C3023",
    backgroundSelected: "#263B2B",
    textSecondary: "#A7B59A",
  },
  dark: {
    text: "#F0F0D2",
    background: "#14251B",
    backgroundElement: "#1C3023",
    backgroundSelected: "#263B2B",
    textSecondary: "#A7B59A",
  },
} as const;

export const SwampColors = {
  background: "#14251B",
  backgroundDeep: "#0B1711",
  panel: "#1C3023",
  panelRaised: "#263B2B",
  border: "#547247",
  moss: "#9BBC55",
  reed: "#D0DB79",
  text: "#F0F0D2",
  muted: "#A7B59A",
  danger: "#E78370",
  success: "#BDE278",
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
