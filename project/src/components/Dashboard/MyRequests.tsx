import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as foodService from "../../Service/foodService";
import FoodCard from "../../components/Food/FoodCard";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) load();
  }, [user]);

  const load = async () => {
    if (!user || !user.id) return;
    const data = await (foodService as any).fetchMyRequests(user.id);
    setRequests(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar currentView={""} onViewChange={function (view: string): void {
                  throw new Error("Function not implemented.");
              } } />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">My Pickup Requests</h1>

          {requests.length === 0 ? (
            <div className="text-gray-600 mt-4">You have not claimed any food yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((donation) => (
                <FoodCard key={donation.id} donation={donation} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
