import { useData, useDataUpdate } from "../contexts/Data"

export default function BestSelect() {
  const data       = useData();
  const updateData = useDataUpdate();

  return (
    <div className="md:flex md:items-center mb-6">
      {/* <div className="md:w-1/3"></div> */}
      <label className="md:w-full block text-gray-200 font-bold">
        <input className="mr-2 leading-tight" type="checkbox" 
          onChange={e => {
            updateData({ 
              ...data, 
              selectedQuality: e.target.checked ? 'best' : (document.getElementById('inline-quality') as HTMLSelectElement).value
            });
          }}

          disabled ={data.state === "downloading"}
        />
        <span className="text-sm">
          Best quality
        </span>
      </label>
    </div>
  )
}