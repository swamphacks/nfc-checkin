import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SwampColors } from "../constants/theme";

type PickerItem = { id: string | number; name: string };

export default function LabeledPicker({
  label,
  selectedValue,
  onValueChange,
  items,
}: {
  label: string;
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  items: PickerItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find((item) => item.id === selectedValue);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} ${selectedItem?.name ?? "Choose an option"}`}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text
          numberOfLines={1}
          style={[styles.triggerText, !selectedItem && styles.placeholder]}
        >
          {selectedItem?.name ?? "CHOOSE AN OPTION"}
        </Text>
        <View style={styles.chevron} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close options"
            onPress={() => setIsOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeading}>
                <Text style={styles.sheetEyebrow}>SELECT TARGET</Text>
                <Text style={styles.sheetTitle}>{label.replace(/:$/, "")}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={styles.doneButton}
              >
                <Text style={styles.doneText}>DONE</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.options}>
              {items.length > 0 ? (
                items.map((item) => {
                  const selected = item.id === selectedValue;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        onValueChange(item.id);
                        setIsOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.option,
                        selected && styles.selectedOption,
                        pressed && styles.pressedOption,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.selectedOptionText,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {selected && <View style={styles.selectedMarker} />}
                    </Pressable>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>NO OPTIONS AVAILABLE</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: {
    color: SwampColors.reed,
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
  },
  trigger: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: SwampColors.border,
    backgroundColor: SwampColors.panelRaised,
  },
  triggerText: {
    flex: 1,
    color: SwampColors.text,
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "700",
  },
  placeholder: { color: SwampColors.muted },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: SwampColors.reed,
    transform: [{ rotate: "45deg" }, { translateY: -2 }],
  },
  pressed: { opacity: 0.82, transform: [{ translateY: 2 }] },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(5, 12, 8, 0.82)",
  },
  sheet: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "80%",
    backgroundColor: SwampColors.panel,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: SwampColors.border,
    padding: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: SwampColors.border,
  },
  sheetHeading: { flex: 1, gap: 5 },
  sheetEyebrow: {
    color: SwampColors.muted,
    fontFamily: "monospace",
    fontSize: 9,
    fontWeight: "700",
  },
  sheetTitle: {
    color: SwampColors.text,
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "900",
  },
  doneButton: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: SwampColors.border,
    backgroundColor: SwampColors.backgroundDeep,
  },
  doneText: {
    color: SwampColors.reed,
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "800",
  },
  options: { flexGrow: 0, marginTop: 8 },
  option: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: SwampColors.backgroundDeep,
    backgroundColor: SwampColors.panel,
  },
  selectedOption: { backgroundColor: SwampColors.panelRaised },
  pressedOption: { backgroundColor: SwampColors.backgroundDeep },
  optionText: {
    flex: 1,
    color: SwampColors.text,
    fontFamily: "monospace",
    fontSize: 13,
  },
  selectedOptionText: { color: SwampColors.reed, fontWeight: "800" },
  selectedMarker: {
    width: 9,
    height: 9,
    backgroundColor: SwampColors.moss,
  },
  emptyText: {
    color: SwampColors.muted,
    fontFamily: "monospace",
    fontSize: 11,
    paddingVertical: 18,
    textAlign: "center",
  },
});
