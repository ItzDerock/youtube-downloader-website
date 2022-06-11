import { Fragment } from "react";
import FormatSelector from "./FormatSelector";
import QualitySelector from "./QualitySelector";
import URLInput from "./URLInput";

export default function Downloader() {

  return (
    <Fragment>
      <form className="w-full max-w-xl">
        <URLInput />
        <FormatSelector />
        <QualitySelector />
        <div className="md:flex md:items-center">
          <div className="md:w-full">
            <button
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Download
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
