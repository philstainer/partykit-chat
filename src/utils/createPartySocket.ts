import PartySocket, { type PartySocketOptions } from "partysocket";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  splitProps,
  type Accessor,
} from "solid-js";
import { isServer } from "solid-js/web";

type UsePartySocketOptions = Omit<PartySocketOptions, "room"> & {
  onOpen?: (event: WebSocketEventMap["open"]) => void;
  onMessage?: (event: WebSocketEventMap["message"]) => void;
  onClose?: (event: WebSocketEventMap["close"]) => void;
  onError?: (event: WebSocketEventMap["error"]) => void;
  room: Accessor<string>;
};

export const createPartySocket = (props: UsePartySocketOptions) => {
  const [options, partySocketOptions] = splitProps(props, [
    "onOpen",
    "onMessage",
    "onClose",
    "onError",
    "room",
  ]);

  const [socket, setSocket] = createSignal(
    new PartySocket({
      ...partySocketOptions,
      room: options.room(),
      startClosed: true,
    })
  );

  if (isServer) return socket;

  createEffect(
    on(
      options.room,
      () => {
        removeEventListeners(socket());
        socket().close();

        const newSocket = new PartySocket({
          ...partySocketOptions,
          room: options.room(),
        });

        addEventListeners(newSocket);

        setSocket(newSocket);
      },
      { defer: true }
    )
  );

  const addEventListeners = (socket: PartySocket) => {
    if (options.onOpen) socket.addEventListener("open", options.onOpen);
    if (options.onClose) socket.addEventListener("close", options.onClose);
    if (options.onError) socket.addEventListener("error", options.onError);
    if (options.onMessage)
      socket.addEventListener("message", options.onMessage);
  };

  const removeEventListeners = (socket: PartySocket) => {
    if (options.onOpen) socket.removeEventListener("open", options.onOpen);
    if (options.onClose) socket.removeEventListener("close", options.onClose);
    if (options.onError) socket.removeEventListener("error", options.onError);
    if (options.onMessage)
      socket.removeEventListener("message", options.onMessage);
  };

  onMount(() => {
    addEventListeners(socket());
    socket().reconnect();
  });

  onCleanup(() => {
    removeEventListeners(socket());
    socket().close();
  });

  return socket;
};
