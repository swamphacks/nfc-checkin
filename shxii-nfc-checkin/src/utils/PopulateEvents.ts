import { useApi } from "../hooks/useApi";

export async function populateEvents(extension) {
  const { url } = useApi();
  try {
    const results = await fetch(url + extension);

    const data = await results.json();

    const lis = data.events.map((d) => {
      return { name: d.name, id: d.id };
    });

    return lis;
  } catch (e: any) {
    console.error("Couldn't populate events. Server error likely.", e);
  }
}
