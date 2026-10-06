import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";
import SwampFrame from "../../components/SwampFrame";
import PixelButton from "../../components/PixelButton";

export default function Meals() {
  const [meals, setMeals] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [error, setError] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<string | number>();
  const [selectedMealName, setSelectedMealName] = useState<string>();
  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await populateEvents("nfc/redeemables/meals");
        setMeals(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? String(err));
      }
    }
    loadMeals();
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEventName: selectedMealName,
        selectedEventId: selectedMealId,
        registerUrl: "nfc/redeemables/tag",
      },
    });
  }

  return (
    <SwampFrame section="MEAL REDEMPTION">
      <View style={styles.container}>
        <Text style={styles.title}>Choose a meal</Text>
        <View>
          <LabeledPicker
            label="Select a Meal:"
            selectedValue={selectedMealId}
            onValueChange={(value: string | number) => {
              setSelectedMealId(value);
              const found = meals.find((m) => m.id === value);
              setSelectedMealName(found?.name);
            }}
            items={meals}
          />
          <Text style={styles.selectedLabel}>SELECTED ITEM</Text>
          <Text style={styles.selectedValue}>
            {selectedMealName ?? "NO MEAL SELECTED"}
          </Text>
        </View>

        <View style={styles.actions}>
          <PixelButton
            title="CONTINUE TO SCAN"
            onPress={goToSelect}
            disabled={!selectedMealName}
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
