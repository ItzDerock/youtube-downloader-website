import { Fragment } from "react";
import { useData } from "../contexts/Data";
import BestSelect from "./BestSelect";
import Download from "./Download";
import Downloading from "./Downloading";
import FormatSelector from "./FormatSelector";
import QualitySelector from "./QualitySelector";
import URLInput from "./URLInput";

export default function Downloader() {
  const data = useData();

  return (
    <Fragment>
      <h1 className="text-white text-2xl font-bold">Youtube Downloader</h1>
      <p className="text-white text-md">Input a youtube video and select quality.</p>
      <br />
      
      {
        data.state === "downloading" ? 
        (
          <Downloading />
        )
        : (
          <form className="w-full max-w-xl">
            <URLInput />
            <FormatSelector />
            <QualitySelector />
            <BestSelect />
            <Download />
          </form>
        )
      }

      <br />
      <a href="https://github.com/ItzDerock/youtube-downloader-website" className="text-blue-500">GitHub</a>
      <p className="text-gray-300">
        This service is designed for archival purposes and personal use.<br/>
        Do not download anything that may infringe with copyrights.
      </p>
    </Fragment>
  );
}
