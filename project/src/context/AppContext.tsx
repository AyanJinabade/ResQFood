// FILE: src/context/AppContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  FoodDonation,
  NGORequest,
  Feedback,
  AdminStats,
} from "../types";

interface AppContextType {
  donations: FoodDonation[];
  requests: NGORequest[];
  feedbacks: Feedback[];

  addDonation: (
    donation: Omit<FoodDonation, "id" | "createdAt">
  ) => void;

  updateDonation: (
    id: string,
    updates: Partial<FoodDonation>
  ) => void;

  deleteDonation: (id: string) => void;

  addRequest: (
    request: Omit<NGORequest, "id" | "requestedAt">
  ) => void;

  updateRequest: (
    id: string,
    updates: Partial<NGORequest>
  ) => void;

  addFeedback: (
    feedback: Omit<Feedback, "id" | "createdAt">
  ) => void;

  getAdminStats: () => AdminStats;
}

const AppContext = createContext<
  AppContextType | undefined
>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within an AppProvider"
    );
  }

  return context;
};

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
*/

const mockDonations: FoodDonation[] = [
  {
    id: "1",
    userId: "restaurant-1",
    userName: "Green Garden Restaurant",

    foodName: "Fresh Vegetable Curry",
    foodType: "meals",

    quantity: 50,
    unit: "kg",

    description:
      "Healthy mixed vegetable curry freshly prepared for donation",

    freshnessScore: 92,

    createdAt: new Date(
      Date.now() - 2 * 60 * 60 * 1000
    ).toISOString(),

    expiryTime: new Date(
      Date.now() + 4 * 60 * 60 * 1000
    ).toISOString(),

    status: "available",

    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: "FC Road, Pune",
    },
  },

  {
    id: "2",
    userId: "restaurant-2",
    userName: "Sunrise Hotel",

    foodName: "Biryani Meal Boxes",
    foodType: "meals",

    quantity: 100,
    unit: "meal boxes",

    description:
      "Fresh biryani meal boxes from lunch buffet",

    freshnessScore: 89,

    createdAt: new Date(
      Date.now() - 1 * 60 * 60 * 1000
    ).toISOString(),

    expiryTime: new Date(
      Date.now() + 6 * 60 * 60 * 1000
    ).toISOString(),

    status: "available",

    location: {
      lat: 18.5314,
      lng: 73.8446,
      address: "Camp Area, Pune",
    },
  },
];

/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export const AppProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [donations, setDonations] =
    useState<FoodDonation[]>(mockDonations);

  const [requests, setRequests] = useState<
    NGORequest[]
  >([]);

  const [feedbacks, setFeedbacks] = useState<
    Feedback[]
  >([]);

  /*
  |--------------------------------------------------------------------------
  | DONATION METHODS
  |--------------------------------------------------------------------------
  */

  const addDonation = (
    donation: Omit<FoodDonation, "id" | "createdAt">
  ) => {
    const newDonation: FoodDonation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setDonations((prev) => [
      newDonation,
      ...prev,
    ]);
  };

  const updateDonation = (
    id: string,
    updates: Partial<FoodDonation>
  ) => {
    setDonations((prev) =>
      prev.map((donation) =>
        donation.id === id
          ? { ...donation, ...updates }
          : donation
      )
    );
  };

  const deleteDonation = (id: string) => {
    setDonations((prev) =>
      prev.filter((donation) => donation.id !== id)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | NGO REQUEST METHODS
  |--------------------------------------------------------------------------
  */

  const addRequest = (
    request: Omit<
      NGORequest,
      "id" | "requestedAt"
    >
  ) => {
    const newRequest: NGORequest = {
      ...request,
      id: Date.now().toString(),
      requestedAt: new Date().toISOString(),
    };

    setRequests((prev) => [
      newRequest,
      ...prev,
    ]);
  };

  const updateRequest = (
    id: string,
    updates: Partial<NGORequest>
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, ...updates }
          : request
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | FEEDBACK METHODS
  |--------------------------------------------------------------------------
  */

  const addFeedback = (
    feedback: Omit<Feedback, "id" | "createdAt">
  ) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setFeedbacks((prev) => [
      newFeedback,
      ...prev,
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | ADMIN DASHBOARD STATS
  |--------------------------------------------------------------------------
  */

  const getAdminStats = (): AdminStats => {
    const activeDonations =
      donations.filter(
        (donation) =>
          donation.status === "available"
      ).length;

    return {
      totalUsers: 156,

      totalDonations: donations.length,

      activeDonations,

      totalServed: 2847,

      usersByRole: {
        restaurant: 67,
        society: 34,
        ngo: 52,
        admin: 3,
      },

      donationsByType: {
        meals: 45,
        bakery: 23,
        fruits: 18,
        vegetables: 12,
        dairy: 8,
        other: 6,
      },

      monthlyDonations: [
        {
          month: "Jan",
          count: 87,
        },
        {
          month: "Feb",
          count: 124,
        },
        {
          month: "Mar",
          count: 156,
        },
        {
          month: "Apr",
          count: 189,
        },
        {
          month: "May",
          count: 234,
        },
      ],
    };
  };

  /*
  |--------------------------------------------------------------------------
  | PROVIDER RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <AppContext.Provider
      value={{
        donations,
        requests,
        feedbacks,

        addDonation,
        updateDonation,
        deleteDonation,

        addRequest,
        updateRequest,

        addFeedback,

        getAdminStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};