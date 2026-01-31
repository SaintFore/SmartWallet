import { Pie, PieChart, Tooltip, Cell } from "recharts";
import type { TooltipIndex } from "recharts";
import type { TransactionModel } from "../types/api";
import { useMemo } from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4D4F",
];

type Props = {
  data: TransactionModel[];
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
};

type CharItem = {
  name: string;
  value: number;
};

function toCharItem(tx: TransactionModel): CharItem {
  return {
    name: tx.category,
    value: tx.amount,
  };
}

export default function SummaryChart({
  data,
  isAnimationActive = true,
  defaultIndex,
}: Props) {
  const charData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    const temp = data.map(toCharItem);
    temp.forEach((item) => {
      if (categoryMap.has(item.name)) {
        categoryMap.set(item.name, categoryMap.get(item.name)! + item.value);
      } else {
        categoryMap.set(item.name, item.value);
      }
    });
    return Array.from(categoryMap, ([name, value]) => ({
      name,
      value,
    }));
  }, [data]);
  return (
    <PieChart
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "500px",
        maxHeight: "80vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        data={charData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius="50%"
        fill="#8884d8"
        label
        isAnimationActive={isAnimationActive}
      >
        {charData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip defaultIndex={defaultIndex} />
    </PieChart>
  );
}
