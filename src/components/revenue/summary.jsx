import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { InfoIcons } from "../ui/Icons";

export default function RevenueSummary() {
    
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
  // Define your metrics in an array
  const metricItems = [

    {
      title: "Ledger Balance",
      value: metrics.ledger_balance || 0,
      icon: <InfoIcons className="text-yellow-500 w-5 h-5" />,
    },
    {
      title: "Total Payout",
      value: metrics.total_payout || 0,
      icon: <InfoIcons className="text-yellow-500 w-5 h-5" />,
    },
    {
      title: "Total Revenue",
      value: metrics.total_revenue || 0,
      icon: <InfoIcons className="text-blue-500 w-5 h-5" />,
    },
    
    {
      title: "Pending Payout",
      value: metrics.pending_payout || 0,
      icon: <InfoIcons className="text-blue-500 w-5 h-5" />,
    },
  ];

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
    <div className=" flex flex-col gap-4">
      {metricItems.map((item) => (
        <div
          key={item.title}
          className="  p-4 bg-white rounded-lg items-center"
        >
          <div
            className=" flex justify-between" 
          >

            <div
                className=" h-fit my-auto"
            >
                <h3 
                  className="text-md text-gray-500"
                >
                  {item.title}
                </h3>
            </div>

            {/* Icon */}
            <div className="p-2 rounded">{item.icon}</div>

          </div>
          
          {/* amount */}
          <div>
            <p 
              className="text-4xl"
              style={{ fontFamily: 'DegularBold, sans-serif' }}
            >
              USD {formatFee(item.value.toFixed(2))}

              
              {/* USD {item.value.toFixed(2)} */}
            </p>
          </div>
          
          
        </div>
      ))}
    </div>
  );
}
