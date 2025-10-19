import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import TransactionsAreaChart from "../charts/TransactionsAreaChart";
export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/wallet");
        setMetrics(res.data);
        console.log("Wallet data:", res.data);
      } catch (err) {
        console.error("Failed to fetch wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="border-2 border-[red] flex p-6 mt-20">
      {/* Chart Section */}
      <div className="border-2 border-[red] p-6 mt-20 w-3/4 mr-8">
        <div className="border-2 border-[red] flex">
          <div className="border-2 border-[red] flex ml-10 w-3/4">
            <div className="p-4 bg-white shadow rounded-lg w-fit">
              <h3 className="text-sm">Available Balance</h3>
              <p className="text-7xl font-bold">
                USD {metrics?.balance?.toLocaleString() || "0.00"}
              </p>
            </div>

            <div className="border-2 border-red-500 w-fit flex items-center">
              <button className="px-10 py-4 bg-black shadow rounded-full transition transform hover:scale-105">
                <p className="text-white">Withdraw</p>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg h-64 mb-8 flex items-center justify-center">
          <TransactionsAreaChart/>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="border-2 border-[red] p-6 mt-20 gap-4 mb-8 w-1/4 flex flex-col">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-sm">Balance</h3>
          <p className="text-2xl font-semibold">USD {metrics.balance  || "0.00"}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-sm">Total Revenue</h3>
          <p className="text-2xl font-semibold">USD {metrics.total_revenue || "0.00"}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-sm">Total Payout</h3>
          <p className="text-2xl font-semibold">USD {metrics.total_payout || "0.00"}</p>
        </div>
      </div>
    </div>
  );
}









// export default function DashboardMetrics() {
//   // Hardcoded data for now
//   const stats = {
//     balance: 750.56,
//     total_payout: 500,
//     total_revenue: 1250.56,
//     pending_payout: 0,
//     ledger_balance: 500,
//   };

//   return (
//     <section className="mt-24 px-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-4 shadow rounded-xl bg-white"><h3 className="text-sm">Balance</h3><p className="text-2xl font-semibold">${stats.balance}</p></div>
//         <div className="p-4 shadow rounded-xl bg-white"><h3 className="text-sm">Total Revenue</h3><p className="text-2xl font-semibold">${stats.total_revenue}</p></div>
//         <div className="p-4 shadow rounded-xl bg-white"><h3 className="text-sm">Total Payout</h3><p className="text-2xl font-semibold">${stats.total_payout}</p></div>
//       </div>
//       {/* Chart + Transaction history will follow here */}
//     </section>
//   );
// // }














// export default function DashboardMetrics() {
//   const metrics = {
//     balance: 750.56,
//     total_payout: 500,
//     total_revenue: 1250.56,
//     pending_payout: 0,
//     ledger_balance: 500
//   };

//   return (
//     <div className="border-2 border-[red] flex p-6 mt-20">




//       {/* Chart Placeholder */}
//       <div className="border-2 border-[red] p-6 mt-20 w-3/4 mr-8">

//             <div className="border-2 border-[red] flex"> 

//                 <div className="border-2 border-[red] flex ml-10 w-3/4">

//                     <div className="p-4 bg-white shadow rounded-lg w-fit">
//                         <h3 className="text-sm">Available Balance</h3>
//                         <p className="text-7xl font-bold">USD{"120,000.00"}</p>
//                     </div>

//                     {/* <div className="border-2 border-[red] w-fit">
//                         <button className="px-10 py-4 bg-black shadow rounded-full mt-4">
//                             <p className="text-white">Withdraw</p>
//                         </button>
//                     </div> */}
                    
//                     {/* <div className="border-2 border-red-500 h-16 flex items-center my-auto">
//                         <button className="h-full px-10 bg-black shadow rounded-full">
//                             <p className="text-white">Withdraw</p>
//                         </button>
//                     </div> */}

// <div className="border-2 border-red-500 w-fit flex items-center">
//   <button className="px-10 py-4 bg-black shadow rounded-full transition transform hover:scale-105">
//     <p className="text-white">Withdraw</p>
//   </button>
// </div>

//                 </div>
//             </div>
            
//             <div className="bg-white shadow rounded-lg h-64 mb-8 flex items-center justify-center">
//                 Chart comes here
//             </div>
            
//       </div>

//       {/* Metrics Cards */}
//       <div className="border-2 border-[red] p-6 mt-20 gap-4 mb-8 w-1/4 flex flex-col">
//         <div className="p-4 bg-white shadow rounded-lg"><h3 className="text-sm">Balance</h3><p className="text-2xl font-semibold">USD{metrics.balance}</p></div>
//         <div className="p-4 bg-white shadow rounded-lg"><h3 className="text-sm">Total Revenue</h3><p className="text-2xl font-semibold">USD{metrics.total_revenue}</p></div>
//         <div className="p-4 bg-white shadow rounded-lg"><h3 className="text-sm">Total Payout</h3><p className="text-2xl font-semibold">USD{metrics.total_payout}</p></div>
//       </div>

//     </div>
//   );
// }
