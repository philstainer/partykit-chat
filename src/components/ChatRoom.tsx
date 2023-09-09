import usePartySocket from "partysocket/react";

export const ChatRoom = () => {
  const socket = usePartySocket({
    host: import.meta.env.PUBLIC_PARTYKIT_SERVER,
    room: "partykit-chat",
    onOpen: () => console.log("socket open"),
    onClose: () => console.log("socket closed"),
    onMessage: (event) => console.log("socket message", event),
  });

  console.log({ socket });

  return <div>Chat room</div>;
};
