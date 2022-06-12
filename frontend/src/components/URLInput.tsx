import { useData, useDataUpdate } from "../contexts/Data";
import { DebounceInput } from "react-debounce-input";

export default function URLInput() {
  const url    = useData();
  const setURL = useDataUpdate();

  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label
          className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="inline-url"
        >
          Youtube URL
        </label>
      </div>
      <div className="md:w-2/3">
        <DebounceInput
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-full-name"
          type="url"
          placeholder="youtube.com/watch?v=6stlCkUDG_s"

          debounceTimeout={500}
          disabled={url.state === "downloading"}

          onChange={(e) => {
            setURL({ ...url, url: e.target.value });
          }}
        />
      </div>
    </div>
  );
}
