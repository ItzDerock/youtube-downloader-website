export default function QualitySelector() {
  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label
          className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="inline-format"
        >
          Quality
        </label>
      </div>
      <div className="md:w-2/3">
        {/* create dropdown menu */}
        <select
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-format"
          disabled={true}
        >
          <option value="1234">1920x1080 @ 60fps</option>
          <option value="mp4">MP4</option>
        </select>
      </div>
    </div>
  )
}