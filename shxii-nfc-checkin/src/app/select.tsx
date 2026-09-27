import SelectPage from "../components/SelectPage";
import { useLocalSearchParams } from "expo-router";

export default function Select() {
  const { selectedEventName, selectedEventId, registerUrl } =
    useLocalSearchParams();

  return (
    <SelectPage
      selectedEventName={selectedEventName}
      registerUrl={registerUrl}
      selectedEventId={selectedEventId}
    />
  );
}
