import Piano from "../components/Piano"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <h1 className="text-3xl font-bold mb-8">Interactive Piano</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <Piano />
      </div>
      <p className="text-center m-5 bg-white px-4 py-2 rounded-3xl shadow-lg">Developed by Mukhriddin-DEV.</p>
    </div>
  )
}
