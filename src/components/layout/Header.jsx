// HeaderLayout.jsx
import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { HomeIcon, AnalyticsIcon, CrmIcon, AppsIcon, NotificationsIcon, MessageIcon, MenuIcon } from "../ui/Icons";
import Sidebar from "./Sidebar";
import SiteLogo from "./SiteLogo";
import axiosInstance from "../../services/axios";

const navItems = [
  { title: "Home", url: "/home", icon: <HomeIcon size={18} /> },
  { title: "Analytics", url: "/analytics", icon: <AnalyticsIcon size={18} /> },
  { title: "Revenue", url: "/revenue", icon: <FaMoneyBillWave size={18} /> },
  { title: "CRM", url: "/crm", icon: <CrmIcon size={18} /> },
  { title: "Apps", url: "/apps", icon: <AppsIcon size={18} /> }
];

export default function HeaderLayout() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-40 flex items-center px-6 rounded-full">
        <div className="mr-6 hidden md:block">
          <SiteLogo />
        </div>

        <div className="md:hidden flex-1">
          <SiteLogo />
        </div>

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-8">
            {navItems.map(item => {
              const isActive = currentPath === item.url;
              return (
                <div key={item.title}>
                  <a
                    href={item.url}
                    className={`px-4 py-2 rounded-xl text-base font-medium flex items-center gap-2 transition ${isActive ? "bg-black text-white" : "bg-transparent text-black hover:bg-black hover:text-white"}`}
                  >
                    {item.icon}
                    {item.title}
                  </a>
                </div>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-6 text-lg">
          <button><NotificationsIcon/></button>
          <button><MessageIcon/></button>

          <div className="flex items-center justify-between bg-[#EFF1F6] p-1 rounded-[100px] cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#5C6670] to-[#131316]">
              <p className="text-white font-semibold text-lg">{user ? `${user.first_name[0]}${user.last_name[0]}` : "U"}</p>
            </div>
            <button className="p-2 rounded-md hover:bg-gray-200 transition"><MenuIcon /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed right-6 top-20 bg-white shadow-lg rounded-xl w-64 p-4 z-50">
          <div className="grid gap-4 px-2">

            <div
              className="flex gap-2"
            >
            
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#5C6670] to-[#131316]">
                <p className="text-white font-semibold text-lg">{user ? `${user.first_name[0]}${user.last_name[0]}` : "U"}</p>
              </div>
          
              <div>
                <p className="font-semibold mb-2">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
            </div>
            
            <div className="flex flex-col gap-3">
                <div>Settings</div>
                <div>Purchase History</div>
                <div>Refer and Earn</div>
                <div>Integrations</div>
                <div>Report Bug</div>
                <div>Switch Account</div>
                <div>Sign Out</div>
             
            </div>

          </div>

        </div>
      )}
    
    
    
      {/* Floating Sidebar */}
       <div className="fixed top-1/3 hidden md:flex flex-col gap-3 z-40">

         <Sidebar />

       </div>
    
    </>
  );
}
