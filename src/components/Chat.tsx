import { Show, createSignal, onMount } from "solid-js";
import { ChatRoom } from "./ChatRoom";

export const [username, setUsername] = createSignal<string>();

export const Chat = () => {
  onMount(() => {
    const username = sessionStorage.getItem("username");

    if (!username) return;

    setUsername(username);
  });

  return (
    <>
      <Show when={username()} fallback={<EnterUsername />}>
        <ChatRoom username={username()!} />
      </Show>
    </>
  );
};

const EnterUsername = () => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username")?.toString();

    if (!username) return;

    sessionStorage.setItem("username", username);
    setUsername(username);
  };

  return (
    <form onsubmit={handleSubmit}>
      <input type="text" name="username" minLength={2} />
      <button type="submit">Submit</button>
    </form>
  );
};
