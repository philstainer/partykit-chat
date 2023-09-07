import { createSignal } from "solid-js";

export const Test = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
    </div>
  );
};
