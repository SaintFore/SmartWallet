import { useState, useEffect } from "react";
import type { ResponseModel, TransactionModel } from "./types/api";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";

function App() {
  const [status, setStatus] = useState("None");
  const [version, setVersion] = useState("Nothing");
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then((data: ResponseModel) => {
        setStatus(data.status);
        setVersion(data.version);
      });
  }, []);
  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:8000/api/transactions");
    const data: TransactionModel[] = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, []);

  return (
    <>
      <div className="border p-4 rounded shadow m-4 text-center">
        {status} : {version}
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-8">
        <TransactionForm onSuccess={fetchTransactions} />
        <TransactionList data={transactions} />
      </div>
    </>
  );
}

export default App;
