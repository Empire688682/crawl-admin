"use client";
import { useGlobalContext } from "../Context"

export default function Dashboard() {
  const {totalSongByUser} = useGlobalContext();
    return (
      <div className="flex-1 p-8 bg-[#0e0e0e] text-white w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Songs Uploaded" value={totalSongByUser} sub={`${totalSongByUser} Singles, 2 Albums, 1 Ep`} />
          <StatCard title="Total Purchases" value="0" sub={""/*+12% from last month*/} />
          <StatCard title="Revenue This Month" value="₦0" sub={""/**+8% from last month */} />
          <StatCard title="All-time Revenue" value="₦0" sub={""/**Since November 2024 */} />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p>No data available</p>
            {/*
            <ul className="space-y-3 text-sm text-gray-300">
              <li>🎵 You uploaded 4 new vibes on April 2nd, 2025</li>
              <li>🛒 John Doe purchased "Midnight Groove" for ₦1,500</li>
              <li>💰 You earned from ₦95,000 sales today</li>
              <li>📢 Your album "Timeless Journey" is now live</li>
            </ul>*/}
          </div>
  
          <div className="bg-[#1a1a1a] p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Songs & Purchases</h2>
            <p>No data available</p>
            {/*<div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between">
                  <span>Monthly Revenue</span>
                  <span>₦1.5M</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded mt-1">
                  <div className="bg-green-500 h-full rounded w-[80%]" />
                </div>
              </div>
  
              <div>
                <div className="flex justify-between">
                  <span>Lifetime Revenue</span>
                  <span>₦4.7M</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded mt-1">
                  <div className="bg-green-400 h-full rounded w-[90%]" />
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    )
  }
  
  function StatCard({ title, value, sub }) {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-md shadow text-center">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <p className="text-lg font-bold mt-1">{value}</p>
        <p className="text-xs mt-1 text-green-400">{sub}</p>
      </div>
    )
  }
  