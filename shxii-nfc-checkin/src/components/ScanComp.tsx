import {
  View,
  Text,
  TextInput,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import PixelButton from "./PixelButton";

type ScanCompProps = {
  styles: {
    field: StyleProp<ViewStyle>;
    label: StyleProp<TextStyle>;
    input: StyleProp<TextStyle>;
  };
  nfcUuid: string;
  scanningNfc: boolean;
  stopNfcScan: () => void;
  startNfcScan: (
    onSuccess?: (uuid: string) => void,
    onError?: (error: unknown) => void,
  ) => Promise<void>;
};

export default function ScanComp({
  styles,
  nfcUuid,
  scanningNfc,
  stopNfcScan,
  startNfcScan,
}: ScanCompProps) {
  function handleScanError(err: unknown) {
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
      <PixelButton
        title={scanningNfc ? "STOP NFC SCAN" : "SCAN NFC TAG"}
        tone={scanningNfc ? "danger" : "primary"}
        onPress={
          scanningNfc
            ? stopNfcScan
            : () => startNfcScan(undefined, handleScanError)
        }
      />
    </View>
  );
}
