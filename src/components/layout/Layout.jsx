import { useEffect, useState } from "react";
import RevenueSummary from "../revenue/summary";
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

  
  // Format fee, add commas for thousands
  const formatFee = (amount) => {
    if (!amount && amount !== 0) return "";
    const num = Number(amount) || 0;
    return `${new Intl.NumberFormat("en-US").format(num)}`;
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="">
      <div
        className="grid lg:flex p-6"
      >
        {/* Chart Section */}
        <div className="px-10 mt-20 lg:w-3/4 mr-8">
          <div className="flex">
            <div className="flex lg:ml-10 lg:w-3/4">
              <div className="p-4 bg-white rounded-lg w-fit">

                <h3 
                  className="text-md text-gray-500 mb-2"
                >
                  Available Balance
                </h3>
                
                <p 
                  className="text-5xl"
                  style={{ fontFamily: 'DegularBold, sans-serif' }}
                >
                  USD {formatFee(metrics?.balance?.toLocaleString() || "0.00")}
                </p>
              </div>

              <div className="w-fit flex items-center lg:ml-5">
                <button className="px-10 py-4 bg-black shadow rounded-full transition transform hover:scale-105">
                  <p className="text-white">Withdraw</p>
                </button>
              </div>
            </div>
          </div>

          <div className=" bg-white rounded-lg flex items-center justify-center">
            <TransactionsAreaChart/>
          </div>
        </div>

        {/* RevenueSummary Cards */}
        <div className="p-6 lg:mt-20 gap-4 mb-8 lg:w-1/4 flex flex-col">
          <RevenueSummary/>
        </div>
      </div>
    </div>
  );
}


