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

type UsePartySocketOptions = PartySocketOptions & {
  onOpen?: (event: WebSocketEventMap["open"]) => void;
  onMessage?: (event: WebSocketEventMap["message"]) => void;
  onClose?: (event: WebSocketEventMap["close"]) => void;
  onError?: (event: WebSocketEventMap["error"]) => void;
};

export const usePartySocket = (props: UsePartySocketOptions) => {
  const [options, partySocketOptions] = splitProps(props, [
    "onOpen",
    "onMessage",
    "onClose",
    "onError",
  ]);

  const [socket, setSocket] = createSignal(
    new PartySocket({
      ...partySocketOptions,
      startClosed: true,
    })
  );

  const updateRoom = (room: string) => {
    removeEventListeners(socket());
    socket().close();

    const newSocket = new PartySocket({
      ...partySocketOptions,
      room,
    });

    addEventListeners(newSocket);

    setSocket(newSocket);
  };

  if (isServer) return [socket, { updateRoom }] as const;

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

  return [socket, { updateRoom }] as const;
};
