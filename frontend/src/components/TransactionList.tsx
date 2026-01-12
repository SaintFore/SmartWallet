import { useEffect, useState } from "react";
import type { TransactionModel } from "../types/api";
function TransactionList() {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/transactions")
      .then((res) => res.json())
      .then((data: TransactionModel[]) => {
        setTransactions(data);
      });
  }, []);
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">我的账单</h2>
      <div className="space-y-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{t.category}</p>
              <p className="text-sm text-gray-500">{t.date}</p>
            </div>
            <p className="text-lg font-mono">{t.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
