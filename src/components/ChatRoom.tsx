import { For, Match, Show, Switch, createSignal } from "solid-js";

import { createStore } from "solid-js/store";
import { createPartySocket } from "../utils/createPartySocket";

type UserMessage = { text: string; type: "user"; sender: string };
type ServerMessage = { text: string; type: "server" };

const [chats, setChats] = createStore<{
  messages: { text: string; sender: string }[];
}>({ messages: [] });

export const ChatRoom = (props: { username: string }) => {
  const socket = createPartySocket({
    host: import.meta.env.PUBLIC_PARTYKIT_SERVER,
    room: () => "partykit-chat",
    onMessage(event) {
      const { type, data } = JSON.parse(event.data);

      console.log(JSON.stringify({ type, data }, null, 2));

      switch (type) {
        // case "welcome":
        //   setChats("messages", (messages) => [
        //     ...messages,
        //     { text: data.message, type: "server" },
        //   ]);
        //   break;

        case "receive-message":
          setChats("messages", (messages) => [
            ...messages,
            { text: data.message, sender: data.sender },
          ]);

        default:
          break;
      }
    },
    query: {
      username: props.username || "anonymous",
    },
  });

  let input: HTMLInputElement;

  const handleSendMessage = (e: Event) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message")?.toString();

    if (!message) return;

    socket().send(JSON.stringify({ type: "sent-message", data: { message } }));
    setChats("messages", (messages) => [
      ...messages,
      { text: message, type: "user", sender: props.username },
    ]);
    input.value = "";
  };

  return (
    <div>
      <p>Username: {props.username}</p>
      <p>Socket: {socket().id}</p>
      <For each={chats.messages}>
        {(message) => (
          <div>
            <Switch>
              <Match when={(message as UserMessage).sender === props.username}>
                <span>Me</span>:
              </Match>
              <Match when={(message as UserMessage).sender !== props.username}>
                <span>{(message as UserMessage).sender}</span>:
              </Match>
            </Switch>

            <span>{message.text}</span>
          </div>
        )}
      </For>

      <form onsubmit={handleSendMessage}>
        <input
          type="text"
          name="message"
          placeholder="Enter Message..."
          ref={(el) => (input = el)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

// const Room = (props: { room: string }) => {
//   const socket = usePartySocket({
//     host: import.meta.env.PUBLIC_PARTYKIT_SERVER,
//     room: () => props.room,
//     onOpen: () => {
//       console.log("Room -> onOpen -> socket open");
//     },
//     onClose: () => {
//       console.log("Room -> onOpen -> socket closed");
//     },
//     onMessage(event) {
//       console.log("Room -> onMessage -> event", event);
//     },
//   });

//   createEffect(() => {
//     console.log(`Room -> createEffect -> room: ${props.room}`);

//     socket().send(
//       JSON.stringify({ type: "ping", data: { message: props.room } })
//     );
//   });

//   return <p>Socket: {socket().id}</p>;
// };
