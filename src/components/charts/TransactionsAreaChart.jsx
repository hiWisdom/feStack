import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export default function TransactionsAreaChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/transactions");
        const transactions = res.data;

        const dailyTotals = {};
        transactions.forEach((item) => {
          const date = item.date;
          const amount = Math.abs(item.amount);

          if (!dailyTotals[date]) {
            dailyTotals[date] = 0;
          }
          dailyTotals[date] += amount;
        });

        const formattedData = Object.keys(dailyTotals)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => ({
            date,
            amount: dailyTotals[date],
          }));

        setData(formattedData);

        // const first = formattedData[0].date;
        // const last = formattedData[formattedData.length - 1].date;

        // const format = (d) =>
        //   new Date(d).toLocaleDateString("en-US", {
        //     month: "short",
        //     day: "numeric",
        //     year: "numeric",
        //   });

        // setDateRange(`${format(first)} to ${format(last)}`);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
        {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
        {/* ✅ XAxis dates removed */}
        <XAxis dataKey="date" tick={false} axisLine={false} />
        {/* <YAxis tickLine={false} axisLine={false} fontSize={12} />
         */}
        <Tooltip />
        <Area type="monotone" dataKey="amount" stroke="#ff5403" fill="#fff" fillOpacity={0.2} />

        {/* Bottom date range labels */}

        <text
          x="0%"
          y={250}
          textAnchor="start"
          fontSize={13}
          fontWeight={500}
        >
          {data.length > 0 ? new Date(data[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
        </text>

        <text
          x="100%"
          y={250}
          textAnchor="end"
          fontSize={13}
          fontWeight={500}
        >
          {data.length > 0 ? new Date(data[data.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
        </text>

      </AreaChart>
    </ResponsiveContainer>
  );
}


