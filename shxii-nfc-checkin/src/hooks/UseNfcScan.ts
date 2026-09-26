import { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import * as Crypto from "expo-crypto";

export function useNfcScan() {
  const [status, setStatus] = useState("Initializing...");
  const [nfcUuid, setNfcUuid] = useState("");
  const [scanningNfc, setScanningNfc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    NfcManager.start();
    checkSupport();

    return () => {
      scanningRef.current = false;
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

  async function startNfcScan(onSuccess, onError) {
    if (scanningRef.current) return; // already running, don't start a second loop
    scanningRef.current = true;
    setScanningNfc(true);
    setStatus("Scanning for NFC tag...");

    while (scanningRef.current) {
      try {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();

        let uuid;
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
        setError(null);
        setStatus("NFC tag captured");
        onSuccess?.(uuid);
      } catch (e) {
        if (!scanningRef.current) break; // stopped intentionally, exit quietly
        setError(e?.message ?? String(e));
        setStatus("NFC scan failed");
        onError?.(e);
      } finally {
        // release the tag handle so the next tap can be detected,
        // but DON'T flip scanningRef/scanningNfc off — loop continues
        await NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    }
  }

  function stopNfcScan() {
    scanningRef.current = false;
    setScanningNfc(false);
    setStatus("NFC scan stopped");
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }

  function resetNfc() {
    setNfcUuid("");
    setError(null);
    setStatus("Ready");
  }

  return {
    status,
    nfcUuid,
    scanningNfc,
    error,
    startNfcScan,
    stopNfcScan,
    resetNfc,
  };
}
