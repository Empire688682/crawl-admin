import { useState } from "react"
import Image from "next/image"
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";


export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")

      // Handle success, e.g. redirect or show toast
      alert("Login successful! 🚀")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="flex justify-center mb-8">
          <Image src="/crawl-logo-.png" alt="Logo" width={100} height={100} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-md shadow-lg"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] outline-none text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] outline-none text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <span onClick={() => setShowPwd(!showPwd)} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-white text-lg">
              {showPwd ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>

          <div className="flex items-center text-sm text-white mb-6">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember">Remember me</label>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white cursor-pointer text-black font-bold py-2 rounded hover:bg-gray-200 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
