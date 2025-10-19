import React, { useState } from "react";
import { FaHome, FaChartLine, FaMoneyBillWave, FaUsers, FaThLarge } from "react-icons/fa";

const navItems = [
  { title: "Home", url: "/home", icon: <FaHome size={18} /> },
  { title: "Analytics", url: "/analytics", icon: <FaChartLine size={18} /> },
  { title: "Revenue", url: "/revenue", icon: <FaMoneyBillWave size={18} /> },
  { title: "CRM", url: "/crm", icon: <FaUsers size={18} /> },
  { title: "Apps", url: "/apps", icon: <FaThLarge size={18} /> }
];


export default function HeaderLayout() {

  //create active state for nav items
  const [active, setActive] = useState("Home"); 

  //variable for current/active link
  const currentPath = window.location.pathname;

  return (
    <>
    <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-40 flex items-center px-6">
      {/* Left Menu Icon */}
      <button className="text-2xl font-semibold mr-8">≡</button>

      {/* Center Navigation - perfectly centered */}


    <nav className="flex-1 flex justify-center">
        <ul className="flex gap-8">
          {navItems.map(item => {
            const isActive = currentPath === item.url; // ✅ match URL instead of state

            return (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={`px-4 py-2 rounded-xl text-base font-medium flex items-center gap-2 transition 
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-transparent text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {item.icon}
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>


      {/* <nav className="flex-1 flex justify-center">
        <ul className="flex gap-8">
          {navItems.map(item => {
            const isActive = active === item.title;
            return (
              <li key={item.title}>
                <a
                  href={item.url}
                  onClick={() => setActive(item.title)}
                  className={`px-4 py-2 rounded-xl text-base font-medium flex items-center gap-2 transition 
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-transparent text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {item.icon}
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav> */}

      {/* <nav className="flex-1 flex justify-center">
        <ul className="flex gap-8">
          {navItems.map(item => (
            <li key={item.title}>
              <a href={item.url} className="text-base font-medium hover:opacity-80 transition">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}

      {/* Right Icons */}
      <div className="flex items-center gap-6 text-lg">
        <button>🔔</button>
        <button>⚙️</button>
        <button>👤</button>
      </div>
    </header>
      {/* Floating Sidebar */}
      <div className="fixed top-1/3 left-4 hidden md:flex flex-col gap-3 p-2 bg-white shadow-md rounded-xl z-40">
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center">?</button>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center">?</button>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center">?</button>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center">?</button>
      </div>

      </>
  );
}

// import React from "react";
// export default function HeaderLayout() {
//   return (
//     <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-sm flex items-center px-8 z-50">
//       {/* Left brand / logo */}
//       <div className="flex items-center gap-2 font-semibold">
//         <span className="text-xl">?</span>
//         <span>Home</span>
//       </div>

//       {/* Center nav */}
//       <nav className="hidden md:flex gap-8 mx-auto">
//         <button className="font-medium">Home</button>
//         <button className="font-medium">Analytics</button>
//         <button className="font-medium px-4 py-2 rounded-full bg-black text-white">Revenue</button>
//         <button className="font-medium">CRM</button>
//         <button className="font-medium">Apps</button>
//       </nav>

//       {/* Right section */}
//       <div className="ml-auto flex items-center gap-4">
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//       </div>
//     </header>
//   );
// }











// import { useState } from 'react';

// export default function HeaderLayout() {
//   const [active, setActive] = useState('Revenue');

//   const navItems = [
//     { title: "Home", url: "/home", icon: "?" },
//     { title: "Analytics", url: "/analytics", icon: "?" },
//     { title: "Revenue", url: "/revenue", icon: "?" },
//     { title: "CRM", url: "/crm", icon: "?" },
//     { title: "Apps", url: "/apps", icon: "?" }
//   ];

//   return (
//     <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-sm z-40 flex items-center px-6">
//       {/* Left Menu Icon */}
//       <button className="text-xl font-bold mr-6">?</button>

//       {/* Center Navigation */}
//       <nav className="hidden md:flex gap-8 mx-auto">
//         {navItems.map(item => (
//           <button
//             key={item}
//             onClick={() => setActive(item)}
//             className={`${active === item ? 'font-semibold border-b-2' : 'text-gray-500'} pb-1`}
//           >
//             {item}
//           </button>
//         ))}
//       </nav>

//       {/* Right Icons */}
//       <div className="ml-auto flex items-center gap-4">
//         <button>?</button>
//         <button>?</button>
//         <button>?</button>
//       </div>
//     </header>
//   );
// }

// import React from "react";

// export default function HeaderLayout() {
//   return (
//     <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-sm flex items-center px-8 z-50">
//       {/* Left brand / logo */}
//       <div className="flex items-center gap-2 font-semibold">
//         <span className="text-xl">?</span>
//         <span>Home</span>
//       </div>

//       {/* Center nav */}
//       <nav className="hidden md:flex gap-8 mx-auto">
//         <button className="font-medium">Home</button>
//         <button className="font-medium">Analytics</button>
//         <button className="font-medium px-4 py-2 rounded-full bg-black text-white">Revenue</button>
//         <button className="font-medium">CRM</button>
//         <button className="font-medium">Apps</button>
//       </nav>

//       {/* Right section */}
//       <div className="ml-auto flex items-center gap-4">
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//         <button className="w-8 h-8 rounded-full border flex items-center justify-center">?</button>
//       </div>
//     </header>
//   );
// }

// export default function Header() {
//   return (
//     <header className="w-full fixed top-0 left-0 bg-white h-20 flex items-center px-8 shadow-sm">
//       <div className="flex items-center gap-2 font-semibold text-lg">
//         <span>▦</span>
//         <span>App</span>
//       </div>
//       <nav className="hidden md:flex ml-10 gap-6 text-sm">
//         <a className="hover:underline">Home</a>
//         <a className="hover:underline">Analytics</a>
//         <a className="px-4 py-2 rounded-full bg-black text-white">Revenue</a>
//         <a className="hover:underline">CRM</a>
//         <a className="hover:underline">Apps</a>
//       </nav>
//       <div className="ml-auto flex items-center gap-4">
//         <div className="w-9 h-9 rounded-full border flex items-center justify-center">?</div>
//         <div className="w-9 h-9 rounded-full border flex items-center justify-center">?</div>
//         <div className="w-9 h-9 rounded-full border flex items-center justify-center">?</div>
//       </div>
//     </header>
//   )
// }