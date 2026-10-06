import { useState } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { useNfcScan } from "../hooks/UseNfcScan";
import ScanComp from "./ScanComp";
import { useRegisterUser } from "../hooks/UseRegisterUser";
import { useApi } from "../hooks/useApi";
import GlowFeedback from "../utils/GlowFeedback";
import SwampFrame from "./SwampFrame";
import PixelButton from "./PixelButton";

type SelectPageProps = {
  selectedEventName?: string | string[];
  registerUrl?: string | string[];
  selectedEventId?: string | string[];
};

export default function SelectPage({
  selectedEventName,
  registerUrl,
  selectedEventId,
}: SelectPageProps) {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [trigger, setTrigger] = useState<number | undefined>();
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
  const eventName = Array.isArray(selectedEventName)
    ? selectedEventName[0]
    : selectedEventName;
  const eventId = Array.isArray(selectedEventId)
    ? selectedEventId[0]
    : selectedEventId;
  const eventUrl = Array.isArray(registerUrl) ? registerUrl[0] : registerUrl;

  return (
    <SwampFrame section="EVENT CHECK-IN">
      <View style={styles.container}>
        <Text style={styles.eyebrow}>READING FOR</Text>
        <Text style={styles.title}>{eventName ?? "SELECT AN EVENT"}</Text>
        <Text style={styles.status}>{status || "READY TO SCAN"}</Text>

        <ScanComp
          styles={styles}
          nfcUuid={nfcUuid}
          scanningNfc={scanningNfc}
          stopNfcScan={stopNfcScan}
          startNfcScan={startNfcScan}
        />
        <GlowFeedback trigger={trigger} success={success} />

        <View style={styles.actions}>
          <PixelButton
            title="REGISTER CHECK-IN"
            onPress={async () => {
              try {
                const val = await registerUser(
                  url + (eventUrl ?? ""),
                  nfcUuid,
                  eventId,
                );
                resetNfc();
                setTrigger(Date.now());
                setSuccess(!!val.res);
                setMessage(val.msg);
              } catch (e) {
                console.error("register failed:", e);
                setMessage(
                  e instanceof Error ? e.message : "Registration failed",
                );
                resetNfc();
                setTrigger(Date.now());
                setSuccess(false);
              }
            }}
            disabled={!nfcUuid}
          />
        </View>

        <View style={styles.actions}>
          <PixelButton
            title="RESET SCAN"
            onPress={() => {
              resetNfc();
              setMessage("");
              setSuccess(null);
            }}
            tone="secondary"
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
    </SwampFrame>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, gap: 16, justifyContent: "center" },
  eyebrow: {
    fontSize: 10,
    color: "#9BBC55",
    fontWeight: "800",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    color: "#F0F0D2",
  },
  status: {
    fontSize: 12,
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
