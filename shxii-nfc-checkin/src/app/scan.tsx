import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { submitCheckIn } from '@/lib/checkin';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [lastValue, setLastValue] = useState<string | null>(null);

  if (!permission) return <ThemedView style={styles.container} />;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Camera access is needed to scan QR codes.
          </ThemedText>
          <Pressable onPress={requestPermission}>
            <ThemedView type="backgroundElement" style={styles.permissionButton}>
              <ThemedText type="link">Grant Camera Access</ThemedText>
            </ThemedView>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  function handleScan({ data }: { data: string }) {
    if (locked) return;
    setLocked(true);
    setLastValue(data);
    submitCheckIn(data, 'qr').finally(() => setTimeout(() => setLocked(false), 1500));
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={locked ? undefined : handleScan}
      />
      {lastValue && (
        <SafeAreaView style={styles.overlay} pointerEvents="none">
          <ThemedView type="backgroundElement" style={styles.resultBox}>
            <ThemedText type="code">{lastValue}</ThemedText>
          </ThemedView>
        </SafeAreaView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, paddingHorizontal: Spacing.four },
  centerText: { textAlign: 'center' },
  permissionButton: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.four, borderRadius: Spacing.five },
  overlay: { position: 'absolute', bottom: BottomTabInset + Spacing.three, left: Spacing.four, right: Spacing.four, alignItems: 'center' },
  resultBox: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.four, borderRadius: Spacing.three },
});