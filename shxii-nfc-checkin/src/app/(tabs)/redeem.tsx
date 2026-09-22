import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import * as Crypto from "expo-crypto";

NfcManager.start();

export default function LinkScreen() {
  const [status, setStatus] = useState("Initializing...");
  const [nfcUuid, setNfcUuid] = useState("");
  const [scanningNfc, setScanningNfc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scanningRef = useRef(false);


  useEffect(() => {
    checkSupport();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  async function checkSupport() {
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        setStatus("NFC not supported on this device");
        return;
      }
      const enabled = await NfcManager.isEnabled();
      setStatus(enabled ? "Ready" : "NFC is off. Enable it in Settings.");
    } catch {
      setStatus("Could not check NFC status");
    }
  }

  // ---------- NFC ----------
  async function startNfcScan() {
    setError(null);
    setScanningNfc(true);
    scanningRef.current = true;
    setStatus("Scanning NFC tag...");

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      let uuid: string;

      if (tag?.ndefMessage?.length) {
        const record = tag.ndefMessage[0];
        try {
          uuid = Ndef.text.decodePayload(new Uint8Array(record.payload));
        } catch {
          throw new Error("Tag has unreadable NDEF data");
        }
      } else {
        uuid = Crypto.randomUUID();
        const bytes = Ndef.encodeMessage([Ndef.textRecord(uuid)]);
        if (!bytes) throw new Error("Failed to encode NDEF message");
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      }

      setNfcUuid(uuid);
      setStatus("NFC tag captured");
    } catch (e: any) {
      if (scanningRef.current) {
        setError(e?.message ?? String(e));
        setStatus("NFC scan failed");
      }
    } finally {
      setScanningNfc(false);
      scanningRef.current = false;
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }

  function stopNfcScan() {
    scanningRef.current = false;
    setScanningNfc(false);
    setStatus("NFC scan stopped");
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }






  function resetAll() {
    setNfcUuid("");
    setError(null);
    setStatus("Ready");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read nfc tag</Text>
      <Text style={styles.status}>{status}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>NFC Tag UUID</Text>
        <TextInput
          style={styles.input}
          value={nfcUuid}
          editable={false}
          placeholder="Not scanned yet"
        />
        <Button
          title={scanningNfc ? "Stop NFC Scan" : "Scan NFC Tag"}
          onPress={scanningNfc ? stopNfcScan : startNfcScan}
          color={scanningNfc ? "#c0392b" : undefined}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Link Tag to User"
          onPress={linkTagToUser}
          disabled={!nfcUuid || !userId}
        />
        <Button title="Reset" onPress={resetAll} color="#888" />
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