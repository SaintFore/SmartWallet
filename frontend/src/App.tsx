import { useState, useEffect } from "react";
import type { ResponseModel } from "./types/api";

function App() {
  const [status, setStatus] = useState("None");
  const [version, setVersion] = useState("Nothing");
  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then((data: ResponseModel) => {
        setStatus(data.status);
        setVersion(data.version);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100,
        category: "Groceries",
        date: "2024-06-01",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <>
      <div>{status}</div>
      <div>{version}</div>
    </>
  );
}

export default App;
