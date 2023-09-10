import type {
  Party,
  PartyConnection,
  PartyConnectionContext,
  PartyRequest,
  PartyServer,
  PartyWorker,
} from "partykit/server";

export default class Server implements PartyServer {
  constructor(readonly party: Party) {}

  onConnect(connection: PartyConnection, ctx: PartyConnectionContext) {
    const username =
      new URL(ctx.request.url).searchParams.get("username") ?? "";

    // Send welcome message
    connection.send(
      JSON.stringify({
        type: "welcome",
        data: { message: `Welcome to the party ${username}` },
      })
    );

    // Broadcast user joined message
    this.party.broadcast(
      JSON.stringify({
        type: "user-joined",
        data: { message: `${username} joined the chat` },
      }),
      [connection.id]
    );
  }

  onClose(connection: PartyConnection) {
    const username = new URL(connection.uri).searchParams.get("username") ?? "";

    this.party.broadcast(
      JSON.stringify({
        type: "user-joined",
        data: { message: `${username} left the chat` },
      }),
      [connection.id]
    );
  }

  onMessage(message: string, sender: PartyConnection) {
    const { type, data } = JSON.parse(message as string);

    console.log(JSON.stringify({ type, data }, null, 2));

    const username = new URL(sender.uri).searchParams.get("username") ?? "";

    switch (type) {
      case "sent-message":
        this.party.broadcast(
          JSON.stringify({
            type: "receive-message",
            data: { message: data.message, sender: username },
          }),
          [sender.id]
        );
        break;

      default:
        break;
    }
  }
}

Server satisfies PartyWorker;
