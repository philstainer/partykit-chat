import { createSignal } from "solid-js";

import { init, send } from "../utils/partykit";

export const Test = () => {
  const [count, setCount] = createSignal(0);

  init({
    log(msg) {
      // const log = document.querySelector("#log");
      // if (!log) {
      //   return;
      // }
      // log.textContent += "\n" + JSON.stringify(msg);
    },
    onMessage({ type }) {
      switch (type) {
        case "increment":
          setCount((count) => count + 1);
          break;

        default:
          console.log(`unknown message type: ${type}`);
      }
    },
  });

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => send({ type: "increment", data: null })}>
        Increment someone else's count
      </button>
    </div>
  );
};
