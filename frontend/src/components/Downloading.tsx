import { useData } from "../contexts/Data";

export default function Downloading() {
  const data = useData();

  return (
    <div className="w-[80%] bg-gray-200 rounded-full">
      <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full progress" style={{
        width: `${data.progress ?? 0}%`
      }}> {data.progress ?? 0}%</div>
    </div>
  )
}