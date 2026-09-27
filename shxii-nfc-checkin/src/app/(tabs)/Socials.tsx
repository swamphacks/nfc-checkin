import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import LabeledPicker from "../../components/LabeledPicker";
import { populateEvents } from "../../utils/PopulateEvents";

export default function Socials() {
  const [socials, setSocials] = useState([]);
  const [selectedSocialId, setSelectedSocialId] = useState();
  const [selectedSocialName, setSelectedSocialName] = useState();

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSocials() {
      try {
        const data = await populateEvents("api/workshops/socials");
        setSocials(data);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      }
    }
    loadSocials();
  }, []);

  function goToSelect() {
    router.push({
      pathname: "/select",
      params: {
        selectedEventName: selectedSocialName,
        selectedEventId: selectedSocialId,
        registerUrl: "api/workshops/tag",
      },
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <LabeledPicker
          label="Select a Socials:"
          selectedValue={selectedSocialId}
          onValueChange={(value) => {
            setSelectedSocialId(value);
            const found = socials.find((s) => s.id === value);
            setSelectedSocialName(found?.name);
          }}

          items={socials}
        />
        <Text>Selected: {selectedSocialName}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Select pg"
          onPress={goToSelect}
          color="#888"
          disabled={!selectedSocialName}
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
