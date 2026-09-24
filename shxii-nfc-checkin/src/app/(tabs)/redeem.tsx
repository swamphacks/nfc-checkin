import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import * as Crypto from "expo-crypto";
import { Picker } from '@react-native-picker/picker';

NfcManager.start();

export default function LinkScreen() {
  const [status, setStatus] = useState("Initializing...");
  const [nfcUuid, setNfcUuid] = useState("");
  const [scanningNfc, setScanningNfc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scanningRef = useRef(false);
  const [workshops, setWorkshops] = useState([])
  const [redeemables, setRedeemables] = useState([])
  const [selectedRedeemable, setSelectedRedeemable] = useState()
  const [selectedWorkshop, setSelectedWorkshop] = useState()
  const [wantWorkshop, setWantWorkshop] = useState(true)



  useEffect(() => {
    checkSupport();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

    useEffect(() =>{
        populateEvents();
    }, []);


  async function populateEvents(){
      try {
          const results = await fetch("https://serving-lark-numbing.ngrok-free.dev/api/event-names")
          const data = await results.json()
          console.log()
          const workshopLis = data.workshops.map((d) => {
              return d.title
          })
          const redeemableLis = data.redeemables.map((d) => {
              return d.name
          })
          setWorkshops(workshopLis);
          setRedeemables(redeemableLis);

      } catch (e: any){
          setStatus("Couldn't populate events. Server error likely.")
      }
  }
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

  // ---------- NFC ----------
  async function startNfcScan() {
    setError(null);
    setScanningNfc(true);
    scanningRef.current = true;
    setStatus("Scanning NFC tag...");

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      let uuid: string;

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
      setStatus("NFC tag captured");
    } catch (e: any) {
      if (scanningRef.current) {
        setError(e?.message ?? String(e));
        setStatus("NFC scan failed");
      }
    } finally {
      setScanningNfc(false);
      scanningRef.current = false;
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }

  function stopNfcScan() {
    scanningRef.current = false;
    setScanningNfc(false);
    setStatus("NFC scan stopped");
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }

    function swapWant(){
        setWantWorkshop(!wantWorkshop)
    }

    async function registerUser(){

        try{
            let event
            let url = "https://serving-lark-numbing.ngrok-free.dev/"
            if(wantWorkshop) {event = selectedWorkshop; url += "api/tag-workshop"}
            else {event = selectedRedeemable; url += "api/tag-redeemable"}

            if(!event) {setError("Select a workshop or redeemable before register"); return;}

            if(!nfcUuid) {setError("Scan a nfc first please"); return;}
// TODO: there was an error here where the event was being sent as undefined to the backend
// not sure how to recreate it (it happened after i had the phone on for long and did a bunch of random stuff)
// but its likely because of the way i define what event is
            const data = {
                nfc_id: nfcUuid,
                event: event
            }
            const req = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });

            const result = await req.json()

            console.log(result)
            //TODO: treat this result appropriately for frontend
            setError("")
            setStatus("Posted")
            setSelectedWorkshop("")
            setSelectedRedeemable("")
            setNfcUuid("")
        } catch(e: any){
            console.error(e)
        }
    }






  function resetAll() {
    setNfcUuid("");
    setError(null);
    setStatus("Ready");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read nfc tag</Text>
      <Text style={styles.status}>{status}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>NFC Tag UUID</Text>
        <TextInput
          style={styles.input}
          value={nfcUuid}
          editable={false}
          placeholder="Not scanned yet"
        />
        <Button
          title={scanningNfc ? "Stop NFC Scan" : "Scan NFC Tag"}
          onPress={scanningNfc ? stopNfcScan : startNfcScan}
          color={scanningNfc ? "#c0392b" : undefined}
        />
      </View>
        <View>
        {wantWorkshop ? (
            <>
              <Text>Select a Workshop:</Text>
             <Picker
               selectedValue={selectedWorkshop}
               onValueChange={(itemValue) => setSelectedWorkshop(itemValue)}
             >
               {workshops.map((name) => (
                 <Picker.Item key={name} label={name} value={name} />
               ))}
             </Picker>



             <Button title = "Swap to Redeemable" onPress = {swapWant}/>
             </>


             ) :

             (
                 <>
              <Text>Select a Redeemable:</Text>

                 <Picker
               selectedValue={selectedRedeemable}
               onValueChange={(itemValue) => setSelectedRedeemable(itemValue)}
             >
               {redeemables.map((name) => (
                 <Picker.Item key={name} label={name} value={name} />
               ))}
             </Picker>

             <Button title = "Swap to Workshop" onPress = {swapWant}/>

             </>)
            }


              <Text>Selected: {wantWorkshop ? selectedWorkshop : selectedRedeemable}</Text>
            </View>

      <View style = {styles.actions}>
        <Button title = "Register" onPress ={registerUser} color ="#888"/>
      </View>
      <View style={styles.actions}>

        <Button title="Reset" onPress={resetAll} color="#888" />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {Platform.OS === "android" && scanningNfc && (
        <Text style={styles.hint}>Hold your phone's back near the tag.</Text>
      )}
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