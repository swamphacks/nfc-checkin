import { useState, useRef } from "react";
import { useCameraPermissions } from "expo-camera";

export function useQrScan() {
  const [userId, setUserId] = useState("");
  const [scanningQr, setScanningQr] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [qrStatus, setQrStatus] = useState("");

  const [permission, requestPermission] = useCameraPermissions();
  const qrLockRef = useRef(false); // prevents duplicate scans firing rapidly

  async function openQrScanner() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setQrError("Camera permission is required to scan QR codes");
        return;
      }
    }
    qrLockRef.current = false;
    setQrError(null);
    setScanningQr(true);
  }

  function handleBarcodeScanned(result) {
    if (qrLockRef.current) return; // ignore repeat fires while closing
    qrLockRef.current = true;
    setUserId(result.data);
    setScanningQr(false);
    setQrStatus("QR code captured");
  }

  function closeQrScanner() {
    setScanningQr(false);
  }

  function resetQr() {
    setUserId("");
    setQrError(null);
    setQrStatus("");
  }

  return {
    userId,
    scanningQr,
    qrError,
    qrStatus,
    permission,
    openQrScanner,
    handleBarcodeScanned,
    closeQrScanner,
    resetQr,
  };
}
