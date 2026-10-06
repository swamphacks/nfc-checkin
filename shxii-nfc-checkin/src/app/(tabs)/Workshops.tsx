import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";
import SwampFrame from "../../components/SwampFrame";
import PixelButton from "../../components/PixelButton";

export default function Workshops() {
  const [workshops, setWorkshops] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [selectedWorkshopName, setSelectedWorkshopName] = useState<string>();
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<
    string | number
  >();

  const [error, setError] = useState("");
  useEffect(() => {
    async function loadWorkshops() {
      try {
        const data = await populateEvents("nfc/workshops");
        setWorkshops(data);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      }
    }
    loadWorkshops();
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEventName: selectedWorkshopName,
        selectedEventId: selectedWorkshopId,
        registerUrl: "nfc/workshops/tag",
      },
    });
  }

  return (
    <SwampFrame section="WORKSHOP CHECK-IN">
      <View style={styles.container}>
        <Text style={styles.title}>Choose a workshop</Text>
        <View>
          <LabeledPicker
            label="Select a Workshop:"
            selectedValue={selectedWorkshopId}
            onValueChange={(value: string | number) => {
              setSelectedWorkshopId(value);
              const found = workshops.find((w) => w.id === value);
              setSelectedWorkshopName(found?.name);
            }}

            items={workshops}
          />
          <Text style={styles.selectedLabel}>SELECTED ITEM</Text>
          <Text style={styles.selectedValue}>
            {selectedWorkshopName ?? "NO WORKSHOP SELECTED"}
          </Text>
        </View>

        <View style={styles.actions}>
          <PixelButton
            title="CONTINUE TO SCAN"
            onPress={goToSelect}
            disabled={!selectedWorkshopName}
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
