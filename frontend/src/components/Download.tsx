import { useData, useDataUpdate } from "../contexts/Data";

export default function Download() {
  const data   = useData();
  const update = useDataUpdate();

  const disabled = (data.selectedQuality === "") || (data.url === "") || (data.state !== "input");

  return (
    <div className="md:flex md:items-center">
      <div className="md:w-full">
        <button
          className={
            disabled ? "shadow bg-purple-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded hover:cursor-not-allowed"
              : "shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          }
          type="button"

          disabled={disabled}

          onClick={(e) => {
            update({
              ...data,
              state: "downloading"
            });
          }}
        >
          Download
        </button>
      </div>
    </div>
  )
}