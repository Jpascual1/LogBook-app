import { useState, useEffect, useCallback } from "react";
import { Dumbbell } from "lucide-react";
import { DataCard } from "../Components/DataCard";
import { WeekCalandar } from "../Components/WeekCalandar";
import { AddLiftButton } from "../Components/AddLiftButton";
import type { DayData } from "../Components/WeekCalandar";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState("home");

  const week = [
    { day: "Sun", workout: "Rest" },
    { day: "Mon", workout: "Push" },
    { day: "Tue", workout: "Pull" },
    { day: "Wed", workout: "Legs" },
    { day: "Thu", workout: "Push" },
    { day: "Fri", workout: "Pull" },
    { day: "Sat", workout: "Rest" },
  ];

  const [lifts, setLifts] = useState<any[]>([]);

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [getToken]);

  const fetchLifts = useCallback(async () => {
    if (isSignedIn !== true) {
      setLifts([]);
      return;
    }
    try {
      const auth = await authHeaders();
      const response = await fetch(`${API_BASE_URL}/records`, {
        headers: auth,
      });
      const data = await response.json();

      console.log("Fetched lifts:", data);

      setLifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching lifts", err);
    }
  }, [isSignedIn, authHeaders]);

  useEffect(() => {
    fetchLifts();
  }, [fetchLifts]);

  function handleChangePage(day: DayData) {
    setSelectedWorkout(day.workout ?? "home");
  }

  const logWorkout = async (
    name: string,
    currentWeight: number,
    sets: number,
    currentReps: number
  ) => {
    if (isSignedIn !== true) return;
    try {
      const onHomeView = selectedWorkout.toLowerCase() === "home";
      const payload: Record<string, unknown> = {
        name,
        weight: currentWeight,
        reps: currentReps,
        sets,
        date: new Date().toISOString(),
      };
      if (!onHomeView) {
        payload.type = selectedWorkout.toLowerCase();
      }

      const auth = await authHeaders();
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...auth,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Workout saved:", data);

      fetchLifts();
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };

  const addLift = async ({
    name,
    weight,
    reps,
    sets,
    type,
  }: {
    name: string;
    weight: number;
    reps: number;
    sets: number;
    type: string;
  }) => {
    if (isSignedIn !== true) return;
    try {
      const auth = await authHeaders();
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...auth,
        },
        body: JSON.stringify({
          name,
          weight,
          reps,
          sets,
          type,
        }),
      });

      const data = await response.json();
      console.log("New lift saved:", data);
      fetchLifts();
    } catch (err) {
      console.error("Error adding lift:", err);
      throw err;
    }
  };

  const editLift = async (id: string, name: string, type: string) => {
    if (isSignedIn !== true) return;
    try {
      const auth = await authHeaders();
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...auth,
        },
        body: JSON.stringify({
          name,
          type,
        }),
      });

      const data = await response.json();
      console.log("Lift updated:", data);
      fetchLifts();
    } catch (err) {
      console.error("Error editing lift:", err);
      throw err;
    }
  };

  const groupedLifts = lifts.reduce((acc: any, lift: any) => {
    if (!acc[lift.name]) {
      acc[lift.name] = [];
    }

    acc[lift.name].push(lift);
    return acc;
  }, {});

  const latestLifts = Object.values(groupedLifts).map((liftArray: any) => {
    const sorted = liftArray.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const current = sorted[0];
    const previous = sorted[1];

    return {
      ...current,
      _id: current._id,
      oldWeight: previous ? previous.weight : current.weight,
      oldReps: previous ? previous.reps : current.reps,
    };
  });

  const normalizedSelectedWorkout = selectedWorkout.toLowerCase();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedWorkout("home")}
          >
            <Dumbbell className="h-8 w-8" />
            <h1>Workout Logbook</h1>
          </div>
          <div className="flex min-h-10 items-center justify-end gap-2">
            {!isLoaded ? (
              <span className="text-sm text-muted-foreground">Loading…</span>
            ) : isSignedIn !== true ? (
              <>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
        <div className="mb-10 flex justify-center">
          <WeekCalandar week={week} onChangePage={handleChangePage} />
        </div>
        {isLoaded && isSignedIn === true ? (
          <AddLiftButton defaultType={selectedWorkout} onSubmit={addLift} />
        ) : null}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestLifts
            .filter((lift: any) =>
              normalizedSelectedWorkout === "home"
                ? true
                : (lift.type ?? "").toLowerCase() === normalizedSelectedWorkout
            )
            .map((lift: any, index) => (
              <DataCard
                key={lift._id ?? index}
                id={lift._id}
                name={lift.name}
                type={lift.type}
                currentWeight={lift.weight}
                oldWeight={lift.oldWeight}
                currentReps={lift.reps}
                sets={lift.sets}
                lastWorkout={"Just Now"}
                onLogWorkout={(weight, sets, reps) =>
                  logWorkout(lift.name, weight, sets, reps)
                }
                onEditLift={(id, name, type) => editLift(id, name, type)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
