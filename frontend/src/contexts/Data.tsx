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
  qualities: any[];
  selectedQuality: string;
}

const DataContext = React.createContext(defaults);
const DataUpdateContext = React.createContext((() => {}) as React.Dispatch<React.SetStateAction<DataContextType>>);

export const useData = () => useContext(DataContext);
export const useDataUpdate = () => useContext(DataUpdateContext);
export const api = axios.create({ baseURL: process.env.REACT_APP_API_URL }); 

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState(defaults);

  useEffect(() => {
    if(!data.url) return;

    setData(d => ({ ...d, state: "loading" }));
    api.post('/download/probe', data.url, {
      headers: {
        'Content-Type': 'text/plain'
      },

      validateStatus: () => true
    }).then(res => {
      if(res.data?.success) {
        setData(d => ({
          ...d,
          state: "input",
          qualities: res.data.info.formats,
          selectedQuality: ""
        }));

        return;
      } 

      setData(d => ({
        ...d,
        state: "invalid-url",
        qualities: [],
        selectedQuality: ""
      }));

      toast(res.data?.error ?? res.data?.message ?? `Unknown Error (${res.status})`, {
        type: "error"
      });
    })
  }, [data.url]);

  return (
    <DataUpdateContext.Provider value={setData}>
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </DataUpdateContext.Provider>
  );
}
