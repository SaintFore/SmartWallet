import { useState } from "react";

interface Props {
  onSuccess: () => void; // 回调函数类型
}

export default function TransactionForm({ onSuccess }: Props) {
  // 定义表单状态
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [des, setDes] = useState("");

  const [rawText, setRawText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认刷新页面行为
    setError(null);

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("金额必须是大于0的数字");
      return;
    }

    const payload = {
      amount: amountNumber,
      category,
      date,
    };

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:8000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        // 清空表单
        setAmount("");
        setCategory("Food");
        setDate(new Date().toISOString().split("T")[0]);
        return;
      }

      const text = await res.text();
      setError(`提交失败: ${text}`);
    } catch (err) {
      setError(`提交失败: ${err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      const result = data.result;
      if (result) {
        setAmount(result.amount.toString());
        setCategory(result.category);
        setDate(result.date);
        setDes(result.description || "");
      } else {
        alert("无法解析该文本，请手动输入");
      }
    } catch (e) {
      alert("解析失败，请稍后重试" + e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-blue-100">
        <label className="block text-sm font-bold text-blue-600 mb-2">
          ✨ AI 智能记账
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="例如：昨晚和朋友吃火锅花了320"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
            // 允许回车触发
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            type="button" // 注意：必须是 button，否则在 form 里默认是 submit 会触发表单提交
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 min-w-20"
          >
            {isAnalyzing ? "..." : "识别"}
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow space-y-4"
      >
        {/* 这是一个简单的 Input 示例，你需要补全其他字段 */}
        <div>
          <label className="block text-sm font-medium">金额</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        {/* ... 补全 Category, Date 等 ... */}
        <div>
          <label className="block text-sm font-medium">类别</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">时间</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">描述</label>
          <input
            type="text"
            value={des}
            onChange={(e) => setDes(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          记一笔
        </button>
        {submitting && <div className="text-gray-600 text-sm">提交中...</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </>
  );
}
