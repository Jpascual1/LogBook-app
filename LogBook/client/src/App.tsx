import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { DataCard } from "../Components/DataCard";
import { WeekCalandar } from "../Components/WeekCalandar";
import { AddLiftButton } from "../Components/AddLiftButton";
import type { DayData } from "../Components/WeekCalandar";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function App() {
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

  const [lifts, setLifts] = useState([]);

  useEffect(() => {
    fetchLifts();
  }, []);

  function handleChangePage(day: DayData) {
    setSelectedWorkout(day.workout ?? "home");
  }

  const logWorkout = async (
    name: string,
    currentWeight: number,
    sets: number,
    currentReps: number
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          weight: currentWeight,
          reps: currentReps,
          sets,
          type: selectedWorkout.toLowerCase(),
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      console.log("Workout saved:", data);

      fetchLifts();
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };

  const fetchLifts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/records`);
      const data = await response.json();

      console.log("Fetched lifts:", data);

      setLifts(data);
    } catch (err) {
      console.error("Error fetching lifts", err);
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
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
        <div
          className="mb-8 flex items-center gap-3"
          onClick={() => setSelectedWorkout("home")}
        >
          <Dumbbell className="h-8 w-8" />
          <h1>Workout Logbook</h1>
        </div>
        <div className="mb-10 flex justify-center">
          <WeekCalandar week={week} onChangePage={handleChangePage} />
        </div>
        <AddLiftButton defaultType={selectedWorkout} onSubmit={addLift} />
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
