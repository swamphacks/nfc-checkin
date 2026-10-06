import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";
import SwampFrame from "../../components/SwampFrame";
import PixelButton from "../../components/PixelButton";

export default function Tshirts() {
  const [tshirts, setTshirts] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [selectedTshirtName, setSelectedTshirtName] = useState<string>();
  const [selectedTshirtId, setSelectedTshirtId] = useState<string | number>();

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTshirts() {
      try {
        const data = await populateEvents("nfc/redeemables/Tshirt");
        setTshirts(data);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      }
    }
    loadTshirts();
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEventName: selectedTshirtName,
        selectedEventId: selectedTshirtId,
        registerUrl: "nfc/redeemables/tag",
      },
    });
  }

  return (
    <SwampFrame section="APPAREL REDEMPTION">
      <View style={styles.container}>
        <Text style={styles.title}>Choose a shirt</Text>
        <View>
          <LabeledPicker
            label="Select a Tshirt:"
            selectedValue={selectedTshirtId}
            onValueChange={(value: string | number) => {
              setSelectedTshirtId(value);
              const found = tshirts.find((t) => t.id === value);
              setSelectedTshirtName(found?.name);
            }}

            items={tshirts}
          />
          <Text style={styles.selectedLabel}>SELECTED ITEM</Text>
          <Text style={styles.selectedValue}>
            {selectedTshirtName ?? "NO SHIRT SELECTED"}
          </Text>
        </View>

        <View style={styles.actions}>
          <PixelButton
            title="CONTINUE TO SCAN"
            onPress={goToSelect}
            disabled={!selectedTshirtName}
          />
        </View>
        <View style={styles.actions}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </View>
    </SwampFrame>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, gap: 20, justifyContent: "center" },
  title: { color: "#F0F0D2", fontSize: 20, fontWeight: "900" },
  selectedLabel: {
    color: "#A7B59A",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 12,
  },
  selectedValue: {
    color: "#D0DB79",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  actions: { gap: 10, marginTop: 4 },
  error: { color: "#E78370", textAlign: "center" },
});
