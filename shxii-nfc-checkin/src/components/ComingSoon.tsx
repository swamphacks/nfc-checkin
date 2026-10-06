import { StyleSheet, Text, View } from "react-native";
import SwampFrame from "./SwampFrame";

export default function ComingSoon() {
  return (
    <SwampFrame section="UPCOMING">
      <View style={styles.container}>
        <Text style={styles.kicker}>SIGNAL LOST IN THE FOG</Text>
        <Text style={styles.title}>Coming soon</Text>
        <View style={styles.rule} />
      </View>
    </SwampFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  kicker: { color: "#A7B59A", fontSize: 10, fontWeight: "700" },
  title: { color: "#F0F0D2", fontSize: 24, fontWeight: "900" },
  rule: { width: 72, height: 6, backgroundColor: "#9BBC55" },
});
