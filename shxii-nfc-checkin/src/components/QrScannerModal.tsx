import type { ComponentProps } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { CameraView } from "expo-camera";
import PixelButton from "./PixelButton";
import { SwampColors } from "../constants/theme";

type QrScannerModalProps = {
  visible: boolean;
  onScanned: NonNullable<ComponentProps<typeof CameraView>["onBarcodeScanned"]>;
  onCancel: () => void;
};

export default function QrScannerModal({
  visible,
  onScanned,
  onCancel,
}: QrScannerModalProps) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onScanned}
        />
        <View style={styles.topLabel}>
          <Text style={styles.topLabelText}>SCAN ID QR</Text>
        </View>
        <PixelButton
          title="CANCEL SCAN"
          tone="secondary"
          onPress={onCancel}
          style={styles.closeButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SwampColors.backgroundDeep },
  topLabel: {
    position: "absolute",
    top: 48,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: SwampColors.backgroundDeep,
    borderWidth: 2,
    borderColor: SwampColors.moss,
  },
  topLabelText: {
    color: SwampColors.reed,
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "800",
  },
  closeButton: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    minWidth: 180,
  },
});
