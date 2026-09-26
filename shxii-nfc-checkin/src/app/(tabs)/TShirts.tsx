import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Tshirts() {
  const [tshirts, setTshirts] = useState([]);
  const [selectedTshirts, setSelectedTshirts] = useState();

  useEffect(() => {
    setTshirts(populateEvents("api/tshirts/tshirts"));
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEvent: selectedTshirts,
        registerUrl: "api/tshirts/tag-tshirt",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Tshirt:"
          selectedValue={selectedTshirts}
          onValueChange={(value) => setSelectedTshirts(value)}
          items={tshirts}
        />
        <Text>Selected: {selectedTshirts}</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Select pg" onPress={goToSelect} color="#888" />
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
