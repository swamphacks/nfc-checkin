import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Tshirts() {
  const [tshirts, setTshirts] = useState([]);
  const [selectedTshirtName, setSelectedTshirtName] = useState();
  const [selectedTshirtId, setSelectedTshirtId] = useState();

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTshirts() {
      try {
        const data = await populateEvents("api/redeemables/Tshirt");
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
        registerUrl: "api/redeemables/tag",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Tshirt:"
          selectedValue={selectedTshirtId}
          onValueChange={(value) => {
            setSelectedTshirtId(value);
            const found = tshirts.find((t) => t.id === value);
            setSelectedTshirtName(found?.name);
          }}

          items={tshirts}
        />
        <Text>Selected: {selectedTshirtName}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Select pg"
          onPress={goToSelect}
          color="#888"
          disabled={!selectedTshirtName}
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
