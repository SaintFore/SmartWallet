import { Pie, PieChart, Tooltip } from "recharts";
import type { TooltipIndex } from "recharts";
import type { TransactionModel } from "../types/api";
import { useMemo } from "react";

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
      />
      {/* <Pie */}
      {/*   data={data02} */}
      {/*   dataKey="value" */}
      {/*   cx="50%" */}
      {/*   cy="50%" */}
      {/*   innerRadius="60%" */}
      {/*   outerRadius="80%" */}
      {/*   fill="#82ca9d" */}
      {/*   label */}
      {/*   isAnimationActive={isAnimationActive} */}
      {/* /> */}
      <Tooltip defaultIndex={defaultIndex} />
    </PieChart>
  );
}
