import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SwampColors } from "../constants/theme";

type SwampFrameProps = {
  section: string;
  children: ReactNode;
};

export default function SwampFrame({ section, children }: SwampFrameProps) {
  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.pixelField}>
        <View style={styles.pixelTop} />
        <View style={styles.pixelBottom} />
      </View>
      <View style={styles.header}>
        <View style={styles.brandMark}>
          <View style={styles.markBlockOne} />
          <View style={styles.markBlockTwo} />
          <View style={styles.markBlockThree} />
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.brand}>CHECK-IN</Text>
          <Text style={styles.section}>{section.toUpperCase()}</Text>
        </View>
        <View style={styles.signal}>
          <View style={styles.signalDot} />
          <Text style={styles.signalText}>NFC</Text>
        </View>
      </View>
      <View style={styles.panel}>{children}</View>
      <Text style={styles.footer}>FIELD ACCESS TERMINAL / SHXII</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SwampColors.background,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    overflow: "hidden",
  },
  pixelField: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
  },
  pixelTop: {
    position: "absolute",
    top: 92,
    right: 22,
    width: 12,
    height: 12,
    backgroundColor: SwampColors.border,
  },
  pixelBottom: {
    position: "absolute",
    bottom: 78,
    left: 8,
    width: 18,
    height: 18,
    backgroundColor: SwampColors.panelRaised,
  },
  header: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  brandMark: {
    width: 34,
    height: 34,
    backgroundColor: SwampColors.moss,
    borderWidth: 3,
    borderColor: SwampColors.backgroundDeep,
    position: "relative",
  },
  markBlockOne: {
    position: "absolute",
    width: 8,
    height: 8,
    top: 3,
    left: 3,
    backgroundColor: SwampColors.backgroundDeep,
  },
  markBlockTwo: {
    position: "absolute",
    width: 8,
    height: 8,
    top: 11,
    left: 11,
    backgroundColor: SwampColors.backgroundDeep,
  },
  markBlockThree: {
    position: "absolute",
    width: 8,
    height: 8,
    top: 3,
    right: 3,
    backgroundColor: SwampColors.backgroundDeep,
  },
  brandCopy: { flex: 1, gap: 3 },
  brand: {
    color: SwampColors.text,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  section: {
    color: SwampColors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0,
  },
  signal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: SwampColors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  signalDot: { width: 7, height: 7, backgroundColor: SwampColors.reed },
  signalText: {
    color: SwampColors.reed,
    fontSize: 10,
    fontWeight: "800",
  },
  panel: {
    flex: 1,
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    backgroundColor: SwampColors.panel,
    borderWidth: 2,
    borderColor: SwampColors.border,
    borderBottomWidth: 5,
    padding: 2,
  },
  footer: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    color: SwampColors.muted,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "right",
    paddingTop: 10,
  },
});
