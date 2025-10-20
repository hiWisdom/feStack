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

      } 
      
      catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (

    <div className="w-full">

  

    <ResponsiveContainer width="100%" height={400} className={`flex`}>

      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, }}>
        <XAxis dataKey="date" tick={false} axisLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="amount" stroke="#ff5403" fill="#fff" fillOpacity={0.2} />



      </AreaChart>

    </ResponsiveContainer>
   

{/*     
      <div
        className="border-t-2 border-[#DBDEE5] rounded-t-2xl flex w-full justify-between px-2 mt-[-20px] mb-4"
      > */}

<div
  className="border-t-2 border-[#DBDEE5] flex w-full justify-between px-2 -mt-10 lg:mb-10"
>
        {/* Bottom date range labels */}


        <text
          fontSize={13}
          fontWeight={500}
        >
          {data.length > 0 ? new Date(data[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
        </text>

        <text
          fontSize={13}
          fontWeight={500}
        >
          {data.length > 0 ? new Date(data[data.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
        </text>

      </div>
    

    </div>
  );
}


