export function useRegisterUser() {
  async function registerUser(url, nfcUuid, event) {
    try {
      const data = {
        nfc_id: nfcUuid,
        event: event,
      };
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await req.json();

      if (result.Outcome == "success") {
        return { res: true, msg: result.msg };
      }
      return { res: false, msg: result.msg };
    } catch (e: any) {
      console.error(e);
      return { res: false, msg: e };
    }
  }

  return { registerUser };
}
