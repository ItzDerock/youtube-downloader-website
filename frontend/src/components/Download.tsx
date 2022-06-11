import { useData, useDataUpdate } from "../contexts/Data";

export default function Download() {
  const data   = useData();
  const update = useDataUpdate();

  return (
    <div className="md:flex md:items-center">
      <div className="md:w-full">
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"

          onClick={(e) => {
            console.log(data);
          }}
        >
          Download
        </button>
      </div>
    </div>
  )
}