export const Input = () => {
  return (
    <div>
      <label
        for="price"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Price
      </label>

      <input
        type="text"
        name="price"
        id="price"
        class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="0.00"
      />
    </div>
  );
};
