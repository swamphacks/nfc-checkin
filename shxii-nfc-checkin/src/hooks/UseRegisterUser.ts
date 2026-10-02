export function useRegisterUser() {
  async function registerUser(url, nfcUuid, event) {
    try {
      const data = {
        nfc_id: nfcUuid,
        event_id: event,
      };
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await req.json();


      return result;
    } catch (e: any) {
      console.error(e);
      return { res: false, msg: e?.message ?? String(e) };
    }
  }

  return { registerUser };
}
