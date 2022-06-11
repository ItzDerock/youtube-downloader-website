import { Fragment } from "react";
import BestSelect from "./BestSelect";
import Download from "./Download";
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
        <BestSelect />
        <Download />
      </form>
    </Fragment>
  );
}
