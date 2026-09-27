import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function LabeledPicker({
  label,
  selectedValue,
  onValueChange,
  items,
}) {
  return (
    <View>
      <Text>{label}</Text>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        {items.map((i) => (
          <Picker.Item key={i.id} label={i.name} value={i.id} />
        ))}
      </Picker>
    </View>
  );
}
