import { type PartyKitServer } from "partykit/server";

export default {
  async onRequest(request, room) {
    return Response.json({ ok: false, message: "Not implemented" });
  },
} satisfies PartyKitServer;
