export type CheckInSource = 'nfc' | 'qr';

export async function submitCheckIn(value: string, source: CheckInSource) {
  console.log(`[check-in] ${source.toUpperCase()} ->`, value);
  //backend here methinks

}