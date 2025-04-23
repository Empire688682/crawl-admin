import { FiSearch } from "react-icons/fi"

export default function Topbar() {
  return (
    <div className="w-full px-6 py-4 bg-[#0e0e0e] flex justify-end items-center border-b border-[#2a2a2a]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 bg-[#1c1c1c] text-sm text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}
