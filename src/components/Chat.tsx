import { Show, createSignal, onMount } from "solid-js";
import { ChatRoom } from "./ChatRoom";
import { Input } from "./Input";

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
    <div class="h-full w-full p-4 flex items-center justify-center">
      <form
        onsubmit={handleSubmit}
        class="flex flex-col flex-1 gap-5 sm:max-w-lg"
      >
        <div class="flex flex-col gap-2">
          <label
            for="username"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Enter username
          </label>

          <input
            type="text"
            name="username"
            id="username"
            minLength={2}
            class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-500 py-3 text-slate-100 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
