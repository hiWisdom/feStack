
import { AllProductIcons, FileProductIcons, MoreProductIcon, ProductIcon  } from "../ui/Icons";

const sidebarButtons = [
  { icon: <AllProductIcons  />, action: () => alert("Redirecting to Analytics...") },
  { icon: <FileProductIcons />, action: () => alert("Redirecting to Users...") },
  { icon: <MoreProductIcon />, action: () => alert("Redirecting to Wallet...") },
  { icon: <ProductIcon />, action: () => alert("Redirecting to Settings...") },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-4 p-2 bg-white shadow-md w-[48px]">
      {sidebarButtons.map((btn, idx) => (
        <button
          key={idx}
          className="w-fit h-10 flex items-center justify-center hover:bg-gray-100"
          onClick={btn.action}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}



