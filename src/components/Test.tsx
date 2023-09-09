import { Show, createDeferred, createEffect, createSignal, on } from "solid-js";

import PartySocket from "partysocket";
import { createPartySocket } from "../utils/createPartySocket";
import { usePartySocket } from "../utils/useSocket";

export const Test = () => {
  const [count, setCount] = createSignal(0);
  const [elseCount, setElseCount] = createSignal(0);

  const [room, setRoom] = createSignal("partykit-chat");

  const socket = createPartySocket({
    host: import.meta.env.PUBLIC_PARTYKIT_SERVER,
    room,
    onOpen: () => {
      console.log("Room -> onOpen -> socket open");
    },
    onClose: () => {
      console.log("Room -> onOpen -> socket closed");
    },
    onMessage(event) {
      console.log("Room -> onMessage -> event", event);

      const { type, data } = JSON.parse(event.data);

      switch (type) {
        case "increment-sent":
          setElseCount((count) => count + 1);
          break;

        default:
          break;
      }
    },
  });

  createEffect(() => {
    console.log(`Room -> createEffect -> room: ${room()}`);
  });

  return (
    <div>
      <p>Socket: {socket().id}</p>

      <p>Count: {count()}</p>
      <p>Someone else's count: {elseCount()}</p>

      <button onClick={() => setCount((count) => count + 1)}>Your count</button>
      <button
        onClick={() => {
          // setElseCount((count) => count + 1);
          // send({ type: "increment", data: null });
          socket().send(JSON.stringify({ type: "increment", data: null }));
        }}
      >
        Increment someone else's count
      </button>

      <select
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      >
        <option value="partykit-chat">partykit-chat</option>
        <option value="partykit-chat-2">partykit-chat-2</option>
        <option value="partykit-chat-3">partykit-chat-3</option>
      </select>
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
