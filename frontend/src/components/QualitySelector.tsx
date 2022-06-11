import prettyBytes from "pretty-bytes";
import { useEffect } from "react";
import { useData, useDataUpdate } from "../contexts/Data";

export default function QualitySelector() {
  const data       = useData();
  const updateData = useDataUpdate();

  const onlyAudio  = data.format === "mp3";
  const qualities  = data.qualities.filter((quality, index) => {
    if(!quality.format_id) return false;

    if(onlyAudio && quality.acodec === "none") return false;
    if(!onlyAudio && quality.vcodec === "none") return false;

    if(onlyAudio && quality.abr === 0) return false;
    if(!onlyAudio && quality.vbr === 0) return false;

    // UNCOMMENT FOR SIMPLER OUTPUT
    // if(!onlyAudio) {
    //   const othersWithSameResolution = data.qualities
    //     .filter(other => other.format_id !== quality.format_id)
    //     .filter(data => `${data.width}x${data.height}@${data.fps}` === `${quality.width}x${quality.height}@${quality.fps}`);
      
    //   if(othersWithSameResolution.length) {
    //     // return true;
    //     // check if one is mp4
    //     if(othersWithSameResolution.some(data => data.video_ext === "mp4")) {
    //       return false;
    //     }

    //     // check if this one has a higher bitrate
    //     if(quality.bitrate > Math.max(...othersWithSameResolution.map(data => data.vbr))) {
    //       return true;
    //     }

    //     // check if this is mp4
    //     if(quality.video_ext === "mp4") {
    //       return true;
    //     }

    //     // otherwise keep first one
    //     if(data.qualities.indexOf(quality) === index)
    //       return true; 
    //   }
    // }

    return true;
  }).sort((a, b) => {
    // sort by height, then bitrate
    if(!onlyAudio) {
      if(a.height !== b.height) return b.height - a.height;
      if(a.vbr !== b.vbr) return b.vbr - a.vbr;
      return 0;
    } else {
      return b.abr - a.abr;
    }
  });

  const disabled   = (data.selectedQuality === 'best') || !qualities.length || data.state !== "input";

  useEffect(() => {
    if(!qualities.length) return;

    updateData(d => ({
      ...d,
      selectedQuality: qualities[0].format_id
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.format, data.qualities]);

  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label
          className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="inline-quality"
        >
          Quality
        </label>
      </div>
      <div className="md:w-2/3">
        {/* create dropdown menu */}
        <select
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-quality"
          disabled={disabled}

          onChange={(e) => {
            updateData({ 
              ...data,
              selectedQuality: e.target.value
            });
          }}
        >
          {
            qualities.length > 0 ? (
              qualities.map((quality, index) => (
                <option value={quality.format_id} key={quality.format_id ?? index}>
                  {
                    !onlyAudio ? `${quality.height}x${quality.width} ${quality.fps}fps (${prettyBytes((quality.vbr ?? 0) * 1000) + '/s'})`
                      : `${prettyBytes((quality.abr ?? 0) * 1000)}/s at ${quality.asr}Hz`
                  }
                </option>
              ))
            ) : (
              <option value="-1">
                {
                  data.state === "loading" ? 
                    "Loading qualities..." 
                    : "Enter a valid youtube URL."
                }
              </option>
            )
          }
        </select>
      </div>
    </div>
  )
}