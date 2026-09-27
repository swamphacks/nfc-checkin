import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [selectedMealId, setSelectedMealId] = useState();
  const [selectedMealName, setSelectedMealName] = useState();
  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await populateEvents("api/redeemables/meals");
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
        registerUrl: "api/redeemables/tag",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Meal:"
          selectedValue={selectedMealId}
          onValueChange={(value) => {
            setSelectedMealId(value);
            const found = meals.find((m) => m.id === value);
            setSelectedMealName(found?.name);
          }}
          items={meals}
        />
        <Text>Selected: {selectedMealName}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Select pg"
          onPress={goToSelect}
          color="#888"
          disabled={!selectedMealName}
        />
      </View>
      <View style={styles.actions}>
        <Text style={styles.error}>{error}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 20, justifyContent: "center" },
  actions: { gap: 10, marginTop: 10 },
  error: { color: "red", textAlign: "center" },
  hint: { color: "#666", fontSize: 12, textAlign: "center" },
});
