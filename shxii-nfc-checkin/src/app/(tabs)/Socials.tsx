import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Socials() {
  const [socials, setSocials] = useState([]);
  const [selectedSocials, setSelectedSocials] = useState();

  useEffect(() => {
    setSocials(populateEvents("api/socials/socials"));
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEvent: selectedSocials,
        registerUrl: "api/socials/tag-social",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Socials:"
          selectedValue={selectedSocials}
          onValueChange={(value) => setSelectedSocials(value)}
          items={socials}
        />
        <Text>Selected: {selectedSocials}</Text>
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
