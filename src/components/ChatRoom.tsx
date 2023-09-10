import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
} from "solid-js";

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
  let chatContainer: HTMLDivElement;

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
    input.focus();
  };

  createEffect(
    on(
      () => chats.messages,
      () => {
        scrollToBottom();
      },
      { defer: true }
    )
  );

  function scrollToBottom() {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }

  return (
    <div class="h-full grid grid-rows-[min-content_1fr_min-content]">
      <div>
        <p>Username: {props.username}</p>
        <p>Socket: {socket().id}</p>
      </div>

      <div
        class="overflow-scroll p-4 flex flex-col gap-2"
        ref={(el) => (chatContainer = el)}
      >
        <For each={chats.messages}>
          {(message) => (
            <div
              class={`flex flex-col gap-1 max-w-[80%] ${
                message.sender === props.username ? "self-end" : "self-start"
              }`}
            >
              <small
                class={`text-xs text-slate-500 ${
                  message.sender === props.username ? "self-end" : "self-start"
                }`}
              >
                <Switch>
                  <Match
                    when={(message as UserMessage).sender === props.username}
                  >
                    <span>Me</span>
                  </Match>
                  <Match
                    when={(message as UserMessage).sender !== props.username}
                  >
                    <span>{(message as UserMessage).sender}</span>
                  </Match>
                </Switch>
              </small>

              <span
                class={` text-slate-100 rounded-md py-1 px-2 [text-wrap:balance] ${
                  message.sender === props.username
                    ? "bg-blue-500"
                    : "bg-slate-400"
                }`}
              >
                {message.text}
              </span>
            </div>
          )}
        </For>
      </div>

      <form onsubmit={handleSendMessage} class="flex gap-1 p-2">
        <input
          type="text"
          name="message"
          placeholder="Enter Message..."
          ref={(el) => (input = el)}
          class="block w-full rounded-md border-0 py-2.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <button type="submit" class="bg-blue-500 p-2 text-slate-100 rounded-md">
          Submit
        </button>
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
