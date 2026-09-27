import { View, Text, TextInput, Button } from "react-native";

export default function ScanComp({
  styles,
  nfcUuid,
  scanningNfc,
  stopNfcScan,
  startNfcScan,
}) {
  function handleScanSuccess(uuid) {}

  function handleScanError(err) {
    console.error("scan error:", err);
  }

  return (
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
        onPress={
          scanningNfc
            ? stopNfcScan
            : () => startNfcScan(handleScanSuccess, handleScanError)
        }
        color={scanningNfc ? "#c0392b" : undefined}
      />
    </View>
  );
}
