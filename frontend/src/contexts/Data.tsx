import React, { useContext } from "react";

export const defaults: DataContextType = {
  url: "youtube.com/watch?v=dQw4w9WgXcQ",
  
  state: "noinput",
  format: "mp4",
  
  qualities: {}
};

export type DataContextType = {
  url: string
  state: "noinput" | "loading" | "error" | "downloading" | "invalid-url";
  format: "mp3" | "mp4";
  qualities: { [key: string]: string };
}

const DataContext = React.createContext(defaults);
const DataUpdateContext = React.createContext((() => {}) as React.Dispatch<React.SetStateAction<DataContextType>>);

export const useData = () => useContext(DataContext);
export const useDataUpdate = () => useContext(DataUpdateContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState(defaults);

  return (
    <DataUpdateContext.Provider value={setData}>
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </DataUpdateContext.Provider>
  );
}
