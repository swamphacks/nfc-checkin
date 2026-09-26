import { useState } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { useNfcScan } from "../hooks/UseNfcScan";
import ScanComp from "./ScanComp";
import { useRegisterUser } from "../hooks/UseRegisterUser";
import { useApi } from "../hooks/useApi";
import GlowFeedback from "../utils/GlowFeedback";

export default function SelectPage({ selectedEvent, registerUrl }) {
  const [success, setSuccess] = useState(null);
  const [trigger, setTrigger] = useState();
  const [message, setMessage] = useState("");

  const { url } = useApi();
  const {
    status,
    nfcUuid,
    scanningNfc,
    error,
    startNfcScan,
    stopNfcScan,
    resetNfc,
  } = useNfcScan();

  const { registerUser } = useRegisterUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading for {selectedEvent}</Text>
      <Text style={styles.title}>Read nfc tag</Text>
      <Text style={styles.status}>{status}</Text>

      <ScanComp
        styles={styles}
        nfcUuid={nfcUuid}
        scanningNfc={scanningNfc}
        stopNfcScan={stopNfcScan}
        startNfcScan={startNfcScan}
      />
      <GlowFeedback trigger={trigger} success={success} />

      <View style={styles.actions}>
        <Button
          title="Register"
          onPress={async () => {
            try {
              const val = await registerUser(
                url + registerUrl,
                nfcUuid,
                selectedEvent,
              );
              resetNfc();
              setTrigger(Date.now());
              setSuccess(!!val.res);
              setMessage(val.msg);
            } catch (e) {
              console.log("register failed:", e);
              setMessage(val.msg);
              resetNfc();
              setTrigger(Date.now());
              setSuccess(false);
            }
          }}
          color="#888"
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Reset"
          onPress={() => {
            resetNfc();
            setMessage("");
            setSuccess(null);
          }}
          color="#888"
        />
      </View>
      <View style={styles.actions}>
        {success ? (
          <Text style={styles.hint}>{message}</Text>
        ) : (
          <Text style={styles.error}>{message}</Text>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {Platform.OS === "android" && scanningNfc && (
        <Text style={styles.hint}>Hold your phone's back near the tag.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", textAlign: "center" },
  status: { fontSize: 14, color: "#555", textAlign: "center" },
  field: { gap: 8 },
  label: { fontSize: 13, color: "#333", fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    color: "#333",
  },
  actions: { gap: 10, marginTop: 10 },
  error: { color: "red", textAlign: "center" },
  hint: { color: "#666", fontSize: 12, textAlign: "center" },
  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#000000aa",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});
