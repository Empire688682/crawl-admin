import Image from "next/image";

export default function RevenueDashbord() {
    return (
      <div className="flex flex-col gap-6 p-6 text-white w-full">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1E1E1E] p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-400">Revenue This Month</p>
            <h2 className="text-2xl font-semibold">00</h2>
            <p className="text-green-500 text-sm mt-1">{/*+8% from last month*/}</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-400">All-time Revenue</p>
            <h2 className="text-2xl font-semibold">00</h2>
            <p className="text-sm text-gray-500 mt-1">Since November 2024</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-xl shadow-md flex flex-col justify-between">
            <p className="text-sm text-gray-400">Growth Revenue</p>
            <div className="flex-grow flex items-center justify-center">
              <Image src="/growth-revenue.png" alt="Growth Revenue" width={100} height={100} />
            </div>
          </div>
        </div>
  
        {/* Middle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Performing Songs */}
          <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-1">Top performing songs</h3>
            <p>No data available</p>
            {/*<p className="text-sm text-gray-400 mb-4">This month's most popular tracks</p>
            <ul className="text-sm flex flex-col gap-2">
              <li className="flex justify-between">
                <span>Late Night Conversations</span>
                <span>4:02</span>
              </li>
              <li className="flex justify-between text-gray-400 text-xs">
                <span>EP: Sunset Melodies</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Ride or Die</span>
                <span>3:05</span>
              </li>
              <li className="flex justify-between text-gray-400 text-xs">
                <span>Single</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Levels and Vibes</span>
                <span>3:19</span>
              </li>
              <li className="flex justify-between text-gray-400 text-xs">
                <span>Single</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Golden Hour Groove</span>
                <span>2:18</span>
              </li>
              <li className="flex justify-between text-gray-400 text-xs">
                <span>Album: Midnight Echoes</span>
              </li>
            </ul>
            <button className="mt-4 text-sm text-gray-400 hover:text-white">View all ▾</button>*/}
          </div>
  
          {/* Earnings Breakdown */}
          <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Earnings Breakdown</h3>
            <p>No data available</p>
{/*  <p className="text-sm mb-1">Singles</p>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[66%] bg-orange-400"></div>
            </div>
            <p className="text-sm text-white mb-4">₦641,000 <span className="text-gray-400 text-xs">66% of total</span></p>
  
            <p className="text-sm mb-1">Albums</p>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[49%] bg-green-500"></div>
            </div>
            <p className="text-sm text-white">₦909,000 <span className="text-gray-400 text-xs">49% of total</span></p>*/}
          </div>
        </div>
  
        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tips Received</h3>
            <p>No data available</p>
            {/*<div className="mb-4">
              <p className="text-sm text-gray-400">Tips Overview</p>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="text-green-500">₦52,000</span>
              </div>
              <div className="flex justify-between">
                <span>All Time</span>
                <span className="text-green-500">₦320,000</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-400">Top Tipped Songs</p>
              <div className="flex justify-between">
                <span>Moonlight Serenade</span>
                <span>₦150,000</span>
              </div>
              <div className="flex justify-between">
                <span>Lagos Nights</span>
                <span>₦90,000</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Recent Tips</p>
              <div className="flex justify-between">
                <span>From: Jane D</span>
                <span>₦1,000</span>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
  