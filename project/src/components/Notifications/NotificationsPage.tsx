import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase, useAuth } from "../../context/AuthContext";

import RestaurantNotificationCard from "./RestaurantNotificationCard";
import NGONotificationCard from "./NGONotificationCard";



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

  latitude: number | null;
  longitude: number | null;

  ngo_lat: number | null;
  ngo_lng: number | null;

  donor_id: string | null;
  reserved_by: string | null;

  created_at: string | null;

  /*
  FINAL FIX:
  Must be ARRAY
  */
  profiles?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  }[] | null;
};

type SimpleNotification = {
  id: string;
  title: string | null;
  message: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

export default function NotificationsPage() {
  const { user } = useAuth();

  const [donations, setDonations] =
    useState<Donation[]>([]);

  const [
    simpleNotifications,
    setSimpleNotifications,
  ] = useState<SimpleNotification[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  async function fetchNotifications() {
    if (!user?.email) return;

    setLoading(true);

    try {
      /*
      =====================================
      STEP 1 → GET CURRENT PROFILE
      =====================================
      */

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("id, role")
          .eq("email", user.email)
          .single();

      if (!profile?.id) {
        setLoading(false);
        return;
      }

      /*
      =====================================
      STEP 2 → FETCH DONATION CARDS
      =====================================
      */

      let donationQuery;

      if (profile.role === "restaurant") {
        donationQuery = supabase
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

            latitude,
            longitude,

            ngo_lat,
            ngo_lng,

            donor_id,
            reserved_by,
            created_at,

            profiles!food_donations_reserved_by_fkey(
              full_name,
              email,
              phone,
              address
            )
          `)
          .eq("donor_id", profile.id)
          .not("reserved_by", "is", null)
          .order("created_at", {
            ascending: false,
          });
      } else {
        donationQuery = supabase
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

            latitude,
            longitude,

            ngo_lat,
            ngo_lng,

            donor_id,
            reserved_by,
            created_at,

            profiles!food_donations_donor_id_fkey(
              full_name,
              email,
              phone,
              address
            )
          `)
          .eq("reserved_by", profile.id)
          .order("created_at", {
            ascending: false,
          });
      }

      const {
        data: donationData,
        error,
      } = await donationQuery;

      if (error) {
        console.error(error);
      }

      /*
      =====================================
      STEP 3 → FETCH BELL NOTIFICATIONS
      =====================================
      */

      const {
        data: notificationData,
        error: notificationError,
      } = await supabase
        .from("notifications")
        .select(`
          id,
          title,
          message,
          is_read,
          created_at
        `)
        .eq("user_id", profile.id)
        .order("created_at", {
          ascending: false,
        });

      if (notificationError) {
        console.error(
          notificationError
        );
      }

      /*
      IMPORTANT FIX:
      Explicit casting fixes TS errors
      */

      setDonations(
        (donationData as Donation[]) ||
          []
      );

      setSimpleNotifications(
        notificationData || []
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function markAsRead(
    id: string
  ) {
    await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);

    fetchNotifications();
  }

  /*
  =====================================
  REALTIME
  =====================================
  */

  useEffect(() => {
    fetchNotifications();

    const donationChannel =
      supabase
        .channel(
          "notifications_donation_live"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "food_donations",
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

    const notificationChannel =
      supabase
        .channel(
          "notifications_simple_live"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

    return () => {
      void supabase.removeChannel(
        donationChannel
      );

      void supabase.removeChannel(
        notificationChannel
      );
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-8 h-8 text-green-600" />

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>
      </div>

      {/* MAIN DONATION FLOW */}
      <div className="space-y-6 mb-10">
        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            No reservation requests yet.
          </div>
        ) : (
          donations.map(
            (donation) =>
              user?.role ===
              "restaurant" ? (
                <RestaurantNotificationCard
                  key={donation.id}
                  donation={
                    donation as any
                  }
                  refreshData={
                    fetchNotifications
                  }
                />
              ) : (
                <NGONotificationCard
                  key={donation.id}
                  donation={
                    donation as any
                  }
                  refreshData={
                    fetchNotifications
                  }
                />
              )
          )
        )}
      </div>

      {/* SIMPLE NOTIFICATION HISTORY */}
      <div>
        <h2 className="text-2xl font-bold mb-5">
          Notification History
        </h2>

        {simpleNotifications.length ===
        0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {simpleNotifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    markAsRead(
                      notification.id
                    )
                  }
                  className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition ${
                    notification.is_read
                      ? "bg-white"
                      : "bg-green-50 border-green-300"
                  }`}
                >
                  <h3 className="text-lg font-semibold">
                    {notification.title}
                  </h3>

                  <p className="text-gray-700 mt-2">
                    {
                      notification.message
                    }
                  </p>

                  <p className="text-sm text-gray-400 mt-3">
                    {
                      notification.created_at
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}