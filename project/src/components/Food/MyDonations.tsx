import { useEffect, useState } from "react";
import { supabase, useAuth } from "../../context/AuthContext";
import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Donation = {
  id: string;

  food_name: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  requested_quantity: number | null;
  unit: string | null;

  status: string | null;
  pickup_status: string | null;
  approval_status: string | null;

  reserve_date: string | null;
  reserve_time: string | null;
  created_at: string | null;

  ngo_lat?: number | null;
  ngo_lng?: number | null;

  /*
  IMPORTANT FIX:
  Supabase joined relation returns ARRAY
  not object
  */
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  }[] | null;
};

export default function MyDonations() {
  const { user } = useAuth();

  const [donations, setDonations] =
    useState<Donation[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function fetchMyDonations() {
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
      STEP 2 → FETCH DONATIONS
      =====================================
      */

      const { data, error } =
        await supabase
          .from("food_donations")
          .select(`
            id,
            food_name,
            quantity,
            remaining_quantity,
            requested_quantity,
            unit,

            status,
            pickup_status,
            approval_status,

            reserve_date,
            reserve_time,
            created_at,

            ngo_lat,
            ngo_lng,

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
      Explicit type cast
      fixes TS2345
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
  REALTIME LIVE UPDATE
  =====================================
  */

  useEffect(() => {
    fetchMyDonations();

    const channel = supabase
      .channel("my_donations_live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_donations",
        },
        () => {
          fetchMyDonations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        Loading donations...
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="p-6">
        No donations yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">
        My Donations
      </h2>

      <div className="space-y-5">
        {donations.map((d) => {
          /*
          IMPORTANT FIX:
          profiles is ARRAY → use [0]
          */

          const ngoName =
            d.profiles?.[0]?.full_name ||
            d.profiles?.[0]?.email ||
            "No NGO Yet";

          const isCompleted =
            d.status ===
              "successfully_donated" ||
            d.pickup_status ===
              "completed" ||
            d.pickup_status ===
              "collected";

          return (
            <div
              key={d.id}
              className="bg-white border rounded-2xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-2xl font-bold">
                    {d.food_name}
                  </h3>

                  <p className="text-gray-500">
                    Donation History
                  </p>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                      Successfully Donated
                    </span>
                  ) : d.status ===
                    "reserved" ? (
                    <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                      Reserved
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                      Available
                    </span>
                  )}
                </div>
              </div>

              {/* FINAL COMPLETED HISTORY */}
              {isCompleted ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p>
                      <b>Food Name:</b>{" "}
                      {d.food_name}
                    </p>

                    <p>
                      <b>Quantity Donated:</b>{" "}
                      {d.requested_quantity ||
                        d.quantity}{" "}
                      {d.unit}
                    </p>

                    <p>
                      <b>NGO Name:</b>{" "}
                      {ngoName}
                    </p>

                    <p>
                      <b>Donation Date:</b>{" "}
                      {d.reserve_date ||
                        "-"}
                    </p>

                    <p>
                      <b>Donation Time:</b>{" "}
                      {d.reserve_time ||
                        "-"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-green-700 font-semibold">
                      Final Pickup Status:
                      Completed
                    </p>

                    <p className="text-green-700 font-semibold">
                      Donation Status:
                      Successfully Donated
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
                      Donated Successfully
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* ACTIVE FLOW */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p>
                        <b>Total Quantity:</b>{" "}
                        {d.quantity} {d.unit}
                      </p>

                      <p>
                        <b>
                          Remaining Quantity:
                        </b>{" "}
                        {d.remaining_quantity}{" "}
                        {d.unit}
                      </p>

                      <p>
                        <b>
                          Requested Quantity:
                        </b>{" "}
                        {d.requested_quantity ||
                          0}{" "}
                        {d.unit}
                      </p>

                      <p>
                        <b>NGO Name:</b>{" "}
                        {ngoName}
                      </p>

                      <p>
                        <b>
                          Reserve Date:
                        </b>{" "}
                        {d.reserve_date ||
                          "-"}
                      </p>

                      <p>
                        <b>
                          Reserve Time:
                        </b>{" "}
                        {d.reserve_time ||
                          "-"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p>
                        <b>Status:</b>{" "}
                        {d.status ||
                          "available"}
                      </p>

                      <p>
                        <b>
                          Pickup Status:
                        </b>{" "}
                        {d.pickup_status ||
                          "-"}
                      </p>

                      <p>
                        <b>
                          Approval Status:
                        </b>{" "}
                        {d.approval_status ||
                          "-"}
                      </p>

                      {d.ngo_lat &&
                        d.ngo_lng && (
                          <div className="h-56 rounded-xl overflow-hidden border mt-4">
                            <MapContainer
                              center={[
                                d.ngo_lat,
                                d.ngo_lng,
                              ]}
                              zoom={13}
                              style={{
                                height:
                                  "100%",
                                width:
                                  "100%",
                              }}
                            >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker
                                position={[
                                  d.ngo_lat,
                                  d.ngo_lng,
                                ]}
                              />
                            </MapContainer>
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}