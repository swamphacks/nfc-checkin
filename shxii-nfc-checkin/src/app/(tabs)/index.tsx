import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { useNfcScan } from "../../hooks/UseNfcScan";
import { useQrScan } from "../../hooks/useQrScanner";
import ScanComp from "../../components/ScanComp";
import QrScannerModal from "../../components/QrScannerModal";
import { useRegisterUser } from "../../hooks/UseRegisterUser";
import { useApi } from "../../hooks/useApi";
import GlowFeedback from "../../utils/GlowFeedback";
import SwampFrame from "../../components/SwampFrame";
import PixelButton from "../../components/PixelButton";

export default function LinkScreen() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [trigger, setTrigger] = useState<number | undefined>();

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
  const parsedUserId = userId.replace("IDENT::", "");

  return (
    <SwampFrame section="TAG LINKING">
      <View style={styles.container}>
        <Text style={styles.title}>Link a tag to a person</Text>
        <Text style={styles.status}>{status || "PAIR NFC TAG + ID"}</Text>

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
            value={parsedUserId}
            editable={false}
            placeholder="Not scanned yet"
          />
          <PixelButton title="SCAN ID QR" onPress={openQrScanner} />
        </View>

        <View style={styles.actions}>
          <PixelButton
            title="LINK TAG TO USER"
            onPress={async () => {
              try {
                const val = await registerUser(
                  url + "nfc/checkin/nfc-links",
                  nfcUuid,
                  parsedUserId,
                );
                resetNfc();
                resetQr();
                setTrigger(Date.now());
                setSuccess(!!val.res);
                setMessage(val.msg);
              } catch (e: any) {
                console.error("register failed:", e);
                setMessage(e?.message ?? "Something went wrong");
                resetNfc();
                setTrigger(Date.now());
                setSuccess(false);
                resetQr();
              }
            }}
            disabled={!nfcUuid || !parsedUserId}
          />
          <PixelButton
            title="RESET"
            onPress={() => {
              resetNfc();
              resetQr();
            }}
            tone="secondary"
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
    </SwampFrame>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, gap: 16, justifyContent: "center" },
  title: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    color: "#F0F0D2",
  },
  status: {
    fontSize: 11,
    color: "#D0DB79",
    textAlign: "center",
    fontWeight: "700",
  },
  field: { gap: 8 },
  label: { fontSize: 11, color: "#A7B59A", fontWeight: "700" },
  input: {
    borderWidth: 2,
    borderColor: "#547247",
    padding: 12,
    backgroundColor: "#0B1711",
    color: "#F0F0D2",
    fontFamily: "monospace",
  },
  actions: { gap: 10, marginTop: 4 },
  error: { color: "#E78370", textAlign: "center", fontSize: 12 },
  hint: { color: "#BDE278", fontSize: 12, textAlign: "center" },
});
