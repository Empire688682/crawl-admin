const songs = [
    { title: 'Album: Midnight Echoes (12 songs)', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Moonlight Serenade - 3:45', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Ride or Die - 3:50', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Lagos Nights - 2:18', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'No Stress, No Wahala - 2:59', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Ocean Breeze - 4:03', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Whispers of the City - 3:35', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'Lost in your Rhythm - 3:55', date: '20th Sept, 2024', purchases: 12, status: 'Pending' },
    { title: 'Whispers of the City - 3:35', date: '20th Sept, 2024', purchases: 12, status: 'Live' },
    { title: 'EP: Sunset Melodies (5 Songs)', date: '20th Sept, 2024', purchases: 12, status: 'Pending' },
  ];
  
  export default function AllSong() {
    return (
      <div className="flex-1 p-6 text-white bg-[#0f0f0f]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Songs/Purchased Songs</h2>
          <div className="space-x-4">
            <button className="text-sm text-gray-400 hover:text-white">Filter</button>
            <button className="text-sm text-gray-400 hover:text-white">Sort</button>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3">Song Title</th>
                <th className="py-3">Upload Date</th>
                <th className="py-3">Total Purchases</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {songs.map((song, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="py-3">{song.title}</td>
                  <td className="py-3">{song.date}</td>
                  <td className="py-3">{song.purchases}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        song.status === 'Live' ? 'bg-green-700 text-white' : 'bg-yellow-700 text-white'
                      }`}
                    >
                      {song.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="mt-4 text-sm text-gray-400 hover:text-white cursor-pointer">View all ⌄</div>
      </div>
    );
  }
  