import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshopName, setSelectedWorkshopName] = useState();
  const [selectedWorkshopId, setSelectedWorkshopId] = useState();

  const [error, setError] = useState("");
  useEffect(() => {
    async function loadWorkshops() {
      try {
        const data = await populateEvents("api/workshops/workshops");
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
        registerUrl: "api/workshops/tag",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Workshop:"
          selectedValue={selectedWorkshopId}
          onValueChange={(value) => {
            setSelectedWorkshopId(value);
            const found = workshops.find((w) => w.id === value);
            setSelectedWorkshopName(found?.name);
          }}

          items={workshops}
        />
        <Text>Selected: {selectedWorkshopName}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Select pg"
          onPress={goToSelect}
          color="#888"
          disabled={!selectedWorkshopName}
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
