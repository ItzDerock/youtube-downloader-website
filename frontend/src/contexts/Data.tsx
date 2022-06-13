import axios from "axios";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";

export const defaults: DataContextType = {
  url: "",
  
  state: "input",
  format: "mp4",
  
  qualities: [],
  selectedQuality: ""
};

export type DataContextType = {
  url: string
  state: "input" | "loading" | "error" | "downloading" | "invalid-url";
  format: "mp3" | "mp4";
  qualities: any[]; // i dont feel like creating a new type for this
  selectedQuality: string;

  progress?: number;
  qid?: string;
}

const DataContext = React.createContext(defaults);
const DataUpdateContext = React.createContext((() => {}) as React.Dispatch<React.SetStateAction<DataContextType>>);

export const useData = () => useContext(DataContext);
export const useDataUpdate = () => useContext(DataUpdateContext);
export const api = axios.create({ baseURL: process.env.REACT_APP_API_URL }); 

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState(defaults);

  useEffect(() => {
    // if no url ignore
    if(!data.url) {
      setData(d => ({ ...d, url: "", qualities: [], selectedQuality: "", state: "input" }));
      return;
    }

    // set state to loading and make the request
    setData(d => ({ ...d, state: "loading" }));
    api.post('/download/probe', data.url, {
      headers: {
        'Content-Type': 'text/plain' // override content type to ensure it is text/plain
      },

      validateStatus: () => true
    }).then(res => {
      // if the response is valid, set the data
      if(res.data?.success) {
        setData(d => ({
          ...d,
          state: "input",
          qualities: res.data.info.formats,
          selectedQuality: ""
        }));

        return;
      }

      // otherwise, user provided invalid url
      setData(d => ({
        ...d,
        state: "invalid-url",
        qualities: [],
        selectedQuality: ""
      }));

      // notify user
      toast(res.data?.error ?? res.data?.message ?? `Unknown Error (${res.status})`, {
        type: "error"
      });
    });
  }, [data.url]);

  // starts downloads
  useEffect(() => {
    // if state was changed to downloading, download it
    if(data.state === "downloading") {
      const quality = 
        data.selectedQuality === "best" // best should become bestvideo+bestaudio
          ? 'bestvideo+bestaudio'
          : data.format === "mp4"       // if using a video format, make sure to include bestaudio
            ? `${data.selectedQuality}+bestaudio`
            : data.selectedQuality;     // if audio, no video

      console.log('Downloading with quality: ', quality);

      // queue the download
      api.post('/download/queue', {
        url: data.url,
        format: data.format,
        quality,
      }, {
        validateStatus: () => true
      }).then(data => {
        // set data to the new id
        if(data.data?.success) {
          setData(d => ({ ...d, qid: data.data.id }));
        } else {
          // notify user of any errors
          toast(data.data?.error ?? data.data?.message ?? `Unknown Error (${data.status})`, {
            type: "error"
          });
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.state]);

  // updates progress
  useEffect(() => {
    if(!data.qid) return;

    console.log('Updating progress for', data.qid);
  
    const interval = setInterval(async () => {
      // get the status of the download
      const status = await api.get('/download/status', {
        params: {
          id: data.qid
        },
        validateStatus: () => true
      });

      if(status.data.success) {
        // set the progress
        if(status.data.status === "IN_PROGRESS")
          return setData(d => ({ ...d, progress: status.data.progress }));
      }

      // if finished or failed, clear the interval
      clearInterval(interval);

      // if finished, notify user
      if(status.data.status === "FINISHED") {
        toast("Download finished", {
          type: "success"
        });

        // download the file
        const link = document.createElement("a");
        link.href = `${process.env.REACT_APP_API_URL}/download/download?id=${data.qid}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();
      }

      // if failed, notify user
      if(status.data.status === "FAILED") {
        toast("Download failed: " + status.data.error, {
          type: "error"
        });
      }

      // internal server error
      if(status.status === 500) {
        toast(status.data.error ?? status.data.message ?? "Internal Server Error", {
          type: "error"
        });
      }

      // reset state
      setData(d => ({
        ...d,
        state: "input"
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [data.qid]);

  return (
    <DataUpdateContext.Provider value={setData}>
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </DataUpdateContext.Provider>
  );
}
