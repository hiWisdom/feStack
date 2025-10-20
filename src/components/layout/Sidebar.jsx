import React from "react";
// import { FaChartLine, FaUsers, FaWallet, FaCog } from "react-icons/fa";
import { AllProductIcons, FileProductIcons, MoreProductIcon, ProductIcon  } from "../ui/Icons";

const sidebarButtons = [
  { icon: <AllProductIcons  />, action: () => alert("Redirecting to Analytics...") },
  { icon: <FileProductIcons />, action: () => alert("Redirecting to Users...") },
  { icon: <MoreProductIcon />, action: () => alert("Redirecting to Wallet...") },
  { icon: <ProductIcon />, action: () => alert("Redirecting to Settings...") },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-4 p-2 rounded-xl bg-white shadow-md">
      {sidebarButtons.map((btn, idx) => (
        <button
          key={idx}
          className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
          onClick={btn.action}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}






// import React from "react";
// import { AllProductIcons, FileProductIcons, MoreProductIcon, ProductIcon } from "../ui/Icons";

// const sidebarButtons = [
//   { icon: <AllProductIcons />, action: () => alert("Redirecting to Analytics...") },
//   { icon: <FileProductIcons />, action: () => alert("Redirecting to Users...") },
//   { icon: <MoreProductIcon />, action: () => alert("Redirecting to Wallet...") },
//   { icon: <ProductIcon />, action: () => alert("Redirecting to Settings...") },
// ];

// function renderIcon(icon) {
//   // if not React element, return as-is
//   if (!React.isValidElement(icon)) return icon;

//   // merge className/style
//   const incomingClass = icon.props.className || "";
//   const incomingStyle = icon.props.style || {};

//   const newProps = {
//     className: `${incomingClass} text-gray-500`,        // Tailwind color
//     style: { ...incomingStyle, color: "#6B7280" },     // inline color (currentColor)
//     // try to set fill/stroke to currentColor if not already provided
//     fill: icon.props.fill || "currentColor",
//     stroke: icon.props.stroke || "currentColor",
//     // support libraries that accept a color prop
//     color: icon.props.color || "#6B7280",
//   };

//   return React.cloneElement(icon, newProps);
// }

// export default function Sidebar() {
//   return (
//     <div className="flex flex-col gap-4 p-2 rounded-xl bg-white shadow-md">
//       {sidebarButtons.map((btn, idx) => (
//         <button
//           key={idx}
//           className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
//           onClick={btn.action}
//         >
//           {renderIcon(btn.icon)}
//         </button>
//       ))}
//     </div>
//   );
// }

