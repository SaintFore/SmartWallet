import { useState, useEffect } from "react";
import type { ResponseModel } from "./types/api";
import TransactionList from "./components/TransactionList";

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

  return (
    <>
      <div className="border p-4 rounded shadow m-4 text-center">
        {status} : {version}
      </div>
      <TransactionList />
    </>
  );
}

export default App;
