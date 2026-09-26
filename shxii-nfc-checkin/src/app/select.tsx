import SelectPage from "../components/SelectPage";
import { useLocalSearchParams } from "expo-router";

export default function Select() {
  const { selectedEvent, registerUrl } = useLocalSearchParams();

  return <SelectPage selectedEvent={selectedEvent} registerUrl={regsiterUrl} />;
}
