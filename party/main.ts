import type {
  Party,
  PartyConnection,
  PartyConnectionContext,
  PartyServer,
  PartyWorker,
} from "partykit/server";

export default class Server implements PartyServer {
  constructor(readonly party: Party) {}

  onConnect(connection: PartyConnection, ctx: PartyConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${connection.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    // conn.send("hello from server");
  }

  onClose(connection: PartyConnection) {
    console.log(
      `Disconnected:
  id: ${connection.id}
  room: ${this.party.id}`
    );
  }

  onMessage(message: string, sender: PartyConnection) {
    // let's log the message
    // console.log(`connection ${sender.id} sent message: ${message}`);
    // // as well as broadcast it to all the other connections in the room...
    // this.party.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id]
    // );

    const { type, data } = JSON.parse(message as string);

    switch (type) {
      case "ping":
        sender.send(
          JSON.stringify({
            type: "pong",
            data: {
              message: `hello ${data.message} from server`,
            },
          })
        );
        break;

      case "increment":
        this.party.broadcast(
          JSON.stringify({
            type: "increment",
            data: null,
          }),
          [sender.id]
        );

        this.party.broadcast(
          JSON.stringify({
            type: "increment-sent",
            data: null,
          })
        );
        break;

      default:
        sender.send(
          JSON.stringify({
            message: "no type",
          })
        );
    }
  }
}

Server satisfies PartyWorker;
