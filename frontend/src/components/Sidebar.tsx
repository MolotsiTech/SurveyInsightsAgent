export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6">

      <div className="mb-10">
        <h2 className="text-xl font-bold text-green-400">
          Exxaro AI
        </h2>
      </div>

      <nav className="space-y-4">

        <button className="text-left w-full text-white hover:text-green-400 transition">
          Overview
        </button>

        <button className="text-left w-full text-gray-400 hover:text-green-400 transition">
          Business Units
        </button>

        <button className="text-left w-full text-gray-400 hover:text-green-400 transition">
          Departments
        </button>

        <button className="text-left w-full text-gray-400 hover:text-green-400 transition">
          Campaign Insights
        </button>

      </nav>

    </aside>
  );
}