import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { submitCheckIn } from '@/lib/checkin';

type Status = 'idle' | 'scanning' | 'success' | 'error' | 'unsupported';

export default function CheckInScreen() {
  const [status, setStatus] = useState<Status>('idle');
  const [lastSerial, setLastSerial] = useState<string | null>(null);

  useEffect(() => {
    NfcManager.start();
    NfcManager.isSupported().then((supported) => {
      if (!supported) setStatus('unsupported');
    });
  }, []);

  async function scanTag() {
    setStatus('scanning');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const serial = tag?.id ?? null;
      if (!serial) throw new Error('Tag had no serial');

      setLastSerial(serial);
      setStatus('success');
      await submitCheckIn(serial, 'nfc');
    } catch (ex) {
      console.warn('NFC scan failed', ex);
      setStatus('error');
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Check-In
        </ThemedText>

        {status === 'unsupported' && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            can't use app on this :s 
          </ThemedText>
        )}

        {status !== 'unsupported' && (
          <Pressable onPress={scanTag} disabled={status === 'scanning'}>
            {({ pressed }) => (
              <ThemedView
                type="backgroundElement"
                style={[styles.scanButton, pressed && styles.pressed]}>
                <ThemedText type="link">
                  {status === 'scanning' ? 'Hold tag near device…' : 'Scan NFC Tag'}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        )}

        {status === 'success' && lastSerial && (
          <ThemedView type="backgroundElement" style={styles.resultBox}>
            <ThemedText type="small" themeColor="textSecondary">
              Checked in
            </ThemedText>
            <ThemedText type="code">{lastSerial}</ThemedText>
          </ThemedView>
        )}

        {status === 'error' && (
          <ThemedText type="small" themeColor="textSecondary">
            Couldn't read that tag — try again.
          </ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingBottom: BottomTabInset,
    maxWidth: MaxContentWidth,
  },
  title: { textAlign: 'center' },
  centerText: { textAlign: 'center' },
  scanButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
  },
  resultBox: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
  pressed: { opacity: 0.7 },
});