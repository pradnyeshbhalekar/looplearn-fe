import Navbar from "../components/layout/Navbar"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] p-8">
      <Navbar/>
      <h1 className="text-2xl font-bold text-secondary dark:text-white">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Welcome back! Your daily topic is loading...
      </p>
    </div>
  )
}

export default Dashboard
