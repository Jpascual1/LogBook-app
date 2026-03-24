import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Dumbbell } from "lucide-react";
import { DataCard } from "../Components/DataCard";
import { WeekCalandar } from "../Components/WeekCalandar";
import type { DayData } from "../Components/WeekCalandar";
import "./App.css";

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
    setSelectedWorkout(day.workout ?? null);
  }

  const logWorkout = async (
    name: string,
    currentWeight: number,
    sets: number,
    currentReps: number
  ) => {
    try {
      const response = await fetch("http://localhost:5050/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          weight: currentWeight,
          reps: currentReps,
          sets,
          type: selectedWorkout,
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
      const response = await fetch("http://localhost:5050/records");
      const data = await response.json();

      console.log("Fetched lifts:", data);

      setLifts(data);
    } catch (err) {
      console.error("Error fetching lifts", err);
    }
  };

  const latestLifts = Object.values(
    lifts.reduce((acc: any, lift: any) => {
      const existing = acc[lift.name];

      if (!existing || new Date(lift.date) > new Date(existing.date)) {
        acc[lift.name] = lift;
      }

      return acc;
    }, {})
  );

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestLifts
            .filter((lift: any) =>
              selectedWorkout === "home" ? true : lift.type === selectedWorkout
            )
            .map((lift: any, index) => (
              <DataCard
                key={index}
                name={lift.name}
                currentWeight={lift.weight}
                oldWeight={lift.weight}
                currentReps={lift.reps}
                oldReps={lift.reps}
                sets={lift.sets}
                lastWorkout={"Just Now"}
                onLogWorkout={(weight, sets, reps) =>
                  logWorkout(lift.name, weight, sets, reps)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
