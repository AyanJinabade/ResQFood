// src/pages/dashboard/SocietyDashboard.tsx
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function SocietyDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar currentView={""} onViewChange={function (view: string): void {
                  throw new Error("Function not implemented.");
              } } />

        <main className="flex-1 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome {user?.full_name} 👋
          </h2>

          <p className="text-gray-600">
            Share community meals responsibly and help connect food donors with NGOs.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">What would you like to do today?</h3>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = "/add"}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition"
              >
                Add Community Food Donation
              </button>

              <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg transition"
              >
                View My Donations
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
