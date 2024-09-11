// DataContext.js
import React, { createContext, useState } from "react";

// Créer le contexte
export const DataContext = createContext();

// Créer le fournisseur de contexte
export default function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [imageSend, setImageSend] = useState("");

  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, updateData, imageSend, setImageSend }}>
      {children}
    </DataContext.Provider>
  );
}
