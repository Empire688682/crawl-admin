"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../Context";

export default function AllAlbum() {
  const { userSongs, fetchArtistSongs, router } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const landingPageUrl = process.env.NEXT_PUBLIC_LANDING_PAGE_URL

  console.log("userSongs:", userSongs);

  useEffect(()=>{
    if(userSongs){
      setLoading(false)
    }
  },[userSongs]);

  useEffect(()=>{
    fetchArtistSongs()
  },[loading]);

  const takeMeToLandingPage = (ID) =>{
    router.push(`${landingPageUrl}${ID}`)
  }

  return (
    <div className="flex-1 p-6 text-white bg-[#0f0f0f]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Albums / Purchased Albums</h2>
        <div className="space-x-4">
          <button className="text-sm text-gray-400 hover:text-white">Filter</button>
          <button className="text-sm text-gray-400 hover:text-white">Sort</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3">Album Title</th>
              <th className="py-3 hidden md:block">Upload Date</th>
              <th className="py-3">Total Purchases</th>
              <th className="py-3 pr-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3">Loading...</td>
                    <td className="py-3 hidden md:block">--</td>
                    <td className="py-3">--</td>
                    <td className="py-3 pr-3">--</td>
                  </tr>
                ))
              : userSongs.map((song, i) => (
                  <tr
                    key={song.ID}
                    className="border-b border-gray-800 hover:bg-gray-900 transition"
                    onClick={()=>takeMeToLandingPage(song.ID)}
                  >
                    <td className="py-3">{song.title}</td>
                    <td className="py-3 hidden md:block">
                      {new Date(song.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">{song.total_purchases || 0}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs bg-green-700 text-white
                        }`}
                      >
                        Live
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400 hover:text-white cursor-pointer">
        View all ⌄
      </div>
    </div>
  );
}
