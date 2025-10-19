import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export default function TransactionsAreaChart() {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState("");

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

        const first = formattedData[0].date;
        const last = formattedData[formattedData.length - 1].date;

        const format = (d) =>
          new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

        setDateRange(`${format(first)} to ${format(last)}`);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        {/* ✅ XAxis dates removed */}
        <XAxis dataKey="date" tick={false} axisLine={false} />
        {/* <YAxis tickLine={false} axisLine={false} fontSize={12} />
         */}
        <Tooltip />
        <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />

        {/* ✅ Single bottom label */}
        <text
          x="50%"
          y={250}
          textAnchor="middle"
          fontSize={13}
          fontWeight={500}
        >
          {dateRange}
        </text>
      </AreaChart>
    </ResponsiveContainer>
  );
}




// import { useEffect, useState } from "react";

// import axiosInstance from "../../services/axios";

// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// export default function TransactionsAreaChart() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const res = await axiosInstance.get("/transactions");

//         const transactions = res.data;

//         // ✅ Combine totals per date (all positive numbers)
//         const dailyTotals = {};

//         transactions.forEach((item) => {
//           const date = item.date;
//           const amount = Math.abs(item.amount); // force positive

//           if (!dailyTotals[date]) {
//             dailyTotals[date] = 0;
//           }

//           dailyTotals[date] += amount;
//         });

//         // ✅ Transform into array & sort by date
//         const formattedData = Object.keys(dailyTotals)
//           .sort((a, b) => new Date(a) - new Date(b))
//           .map((date) => ({
//             date,
//             amount: dailyTotals[date],
//           }));

//         setData(formattedData);
//       } catch (err) {
//         console.error("Failed to fetch transactions:", err);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//         <CartesianGrid strokeDasharray="3 3" vertical={false} />
//         <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
//         <YAxis tickLine={false} axisLine={false} fontSize={12} />
//         <Tooltip />
//         <Area
//           type="monotone"
//           dataKey="amount"
//           stroke="#3b82f6"
//           fill="#3b82f6"
//           fillOpacity={0.2}
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// }



// import { useEffect, useState } from "react";
// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// export default function TransactionsAreaChart() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("https://fe-task-api.mainstack.io/transactions")
//       .then((res) => res.json())
//       .then((transactions) => {
//         // Combine totals per date (all positive numbers)
//         const dailyTotals = {};

//         transactions.forEach((item) => {
//           const date = item.date;
//           const amount = Math.abs(item.amount); // force positive

//           if (!dailyTotals[date]) {
//             dailyTotals[date] = 0;
//           }

//           dailyTotals[date] += amount;
//         });

//         // Transform to array & sort by date
//         const formattedData = Object.keys(dailyTotals)
//           .sort((a, b) => new Date(a) - new Date(b))
//           .map((date) => ({
//             date,
//             amount: dailyTotals[date],
//           }));

//         setData(formattedData);
//       })
//       .catch((err) => console.error("Error fetching transactions", err));
//   }, []);

//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//         <CartesianGrid strokeDasharray="3 3" vertical={false} />
//         <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
//         <YAxis tickLine={false} axisLine={false} fontSize={12} />
//         <Tooltip />
//         <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// }
