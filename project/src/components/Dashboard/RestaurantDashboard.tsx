import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { supabase, useAuth } from "../../context/AuthContext";

type Donation = {
  id: string;
  food_name: string | null;
  quantity: number | null;
  requested_quantity: number | null;
  remaining_quantity: number | null;
  unit: string | null;

  status: string | null;
  pickup_status: string | null;
  approval_status: string | null;

  created_at: string | null;
  reserve_date: string | null;
  reserve_time: string | null;

  /*
  IMPORTANT FIX:
  Supabase joined relation returns ARRAY not object
  */
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  }[] | null;
};

export default function RestaurantDashboard() {
  const { user } = useAuth();

  const [donations, setDonations] =
    useState<Donation[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function fetchDashboardData() {
    if (!user?.email) return;

    setLoading(true);

    try {
      /*
      =====================================
      STEP 1 → GET RESTAURANT PROFILE
      =====================================
      */

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .single();

      if (!profile?.id) {
        setLoading(false);
        return;
      }

      /*
      =====================================
      STEP 2 → FETCH ALL DONATIONS
      =====================================
      */

      const { data, error } =
        await supabase
          .from("food_donations")
          .select(`
            id,
            food_name,
            quantity,
            requested_quantity,
            remaining_quantity,
            unit,
            status,
            pickup_status,
            approval_status,
            created_at,
            reserve_date,
            reserve_time,

            profiles!food_donations_reserved_by_fkey(
              full_name,
              email
            )
          `)
          .eq("donor_id", profile.id)
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      /*
      IMPORTANT FIX:
      Explicit casting fixes TS2345
      */

      setDonations(
        (data as Donation[]) || []
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  /*
  =====================================
  REALTIME DASHBOARD SYNC
  =====================================
  */

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel(
        "restaurant_dashboard_live"
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_donations",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [user]);

  /*
  =====================================
  DASHBOARD CALCULATIONS
  =====================================
  */

  const totalDonations =
    donations.length;

  const totalFoodQuantity =
    donations.reduce(
      (sum, d) =>
        sum +
        Number(d.quantity || 0),
      0
    );

  const completedDonations =
    donations.filter(
      (d) =>
        d.status ===
          "successfully_donated" ||
        d.pickup_status ===
          "collected"
    ).length;

  const pendingDonations =
    donations.filter(
      (d) =>
        d.status === "available"
    ).length;

  const reservedDonations =
    donations.filter(
      (d) =>
        d.status === "reserved"
    ).length;

  /*
  IMPORTANT FIX:
  profiles is ARRAY → use [0]
  */

  const ngosServed = new Set(
    donations
      .filter(
        (d) =>
          d.status ===
            "successfully_donated" &&
          (d.profiles?.[0]
            ?.full_name ||
            d.profiles?.[0]
              ?.email)
      )
      .map(
        (d) =>
          d.profiles?.[0]
            ?.full_name ||
          d.profiles?.[0]
            ?.email
      )
  ).size;

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  const cardClass =
    "bg-white rounded-2xl border shadow-sm p-6";

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">
        Restaurant Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                Total Donations
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalDonations}
              </h2>
            </div>

            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                Food Quantity Donated
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalFoodQuantity} KG
              </h2>
            </div>

            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                NGOs Served
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {ngosServed}
              </h2>
            </div>

            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                Completed Donations
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {completedDonations}
              </h2>
            </div>

            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* SECONDARY STATS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-4">
            Pending Donations
          </h3>

          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-600" />

            <span className="text-2xl font-bold">
              {pendingDonations}
            </span>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-4">
            Reserved Donations
          </h3>

          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-600" />

            <span className="text-2xl font-bold">
              {reservedDonations}
            </span>
          </div>
        </div>
      </div>

      {/* RECENT DONATIONS */}
      <div className={cardClass}>
        <h2 className="text-2xl font-bold mb-6">
          Recent Donations
        </h2>

        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          <div className="space-y-4">
            {donations
              .slice(0, 5)
              .map((donation) => {
                /*
                IMPORTANT FIX:
                profiles is ARRAY → use [0]
                */

                const ngoName =
                  donation.profiles?.[0]
                    ?.full_name ||
                  donation.profiles?.[0]
                    ?.email ||
                  "No NGO yet";

                return (
                  <div
                    key={donation.id}
                    className="border rounded-xl p-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {
                            donation.food_name
                          }
                        </h3>

                        <p className="text-gray-600">
                          {
                            donation.quantity
                          }{" "}
                          {donation.unit}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          NGO: {ngoName}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {donation.status ||
                            "available"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {
                            donation.reserve_date
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}