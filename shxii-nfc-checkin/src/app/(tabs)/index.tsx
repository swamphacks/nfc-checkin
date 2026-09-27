import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { useNfcScan } from "../../hooks/UseNfcScan";
import { useQrScan } from "../../hooks/useQrScanner";
import ScanComp from "../../components/ScanComp";
import QrScannerModal from "../../components/QrScannerModal";
import { useRegisterUser } from "../../hooks/UseRegisterUser";
import { useApi } from "../../hooks/useApi";
import GlowFeedback from "../../utils/GlowFeedback";

export default function LinkScreen() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [trigger, setTrigger] = useState();

  const { url } = useApi();

  const { registerUser } = useRegisterUser();

  const { nfcUuid, scanningNfc, startNfcScan, stopNfcScan, resetNfc } =
    useNfcScan();

  const {
    userId,
    scanningQr,
    qrError,
    openQrScanner,
    handleBarcodeScanned,
    closeQrScanner,
    resetQr,
  } = useQrScan();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link NFC Tag to User</Text>
      <Text style={styles.status}>{status}</Text>

      <ScanComp
        styles={styles}
        nfcUuid={nfcUuid}
        scanningNfc={scanningNfc}
        stopNfcScan={stopNfcScan}
        startNfcScan={startNfcScan}
      />

      <View style={styles.field}>
        <Text style={styles.label}>User ID (from QR)</Text>
        <TextInput
          style={styles.input}
          value={userId}
          editable={false}
          placeholder="Not scanned yet"
        />
        <Button title="Scan QR Code" onPress={openQrScanner} />
      </View>

      <View style={styles.actions}>
        <Button
          title="Link Tag to User"
          onPress={async () => {
            try {
              const val = await registerUser(
                url + "api/checkin/nfc-links",
                nfcUuid,
                userId,
              );
              resetNfc();
              setTrigger(Date.now());
              setSuccess(!!val.res);
              setMessage(val.msg);
            } catch (e: any) {
              console.error("register failed:", e);
              setMessage(val.msg);
              resetNfc();
              setTrigger(Date.now());
              setSuccess(false);
            }
          }}
          disabled={!nfcUuid || !userId}
        />
        <Button
          title="Reset"
          onPress={() => {
            resetNfc();
            resetQr();
          }}
          color="#888"
        />
      </View>
      <GlowFeedback trigger={trigger} success={success} />
      <View style={styles.actions}>
        {success ? (
          <Text style={styles.hint}>{message}</Text>
        ) : (
          <Text style={styles.error}>{message}</Text>
        )}
      </View>
      {(error || qrError) && (
        <Text style={styles.error}>{error || qrError}</Text>
      )}
      {Platform.OS === "android" && scanningNfc && (
        <Text style={styles.hint}>Hold your phone's back near the tag.</Text>
      )}

      <QrScannerModal
        visible={scanningQr}
        onScanned={handleBarcodeScanned}
        onCancel={closeQrScanner}
      />
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
});
