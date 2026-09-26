export function useApi() {
  const url = process.env.EXPO_PUBLIC_API_URL;

  return { url };
}
