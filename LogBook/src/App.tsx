import { useState } from "react";
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

  const lifts = [
    {
      name: "Bench Press",
      currentWeight: 185,
      oldWeight: 185,
      currentReps: 5,
      oldReps: 4,
      sets: 3,
      lastWorkout: "3 days ago",
    },
    {
      name: "Squat",
      currentWeight: 245,
      oldWeight: 225,
      currentReps: 5,
      oldReps: 10,
      sets: 2,
      lastWorkout: "4 days ago",
    },
    {
      name: "Deadlift",
      currentWeight: 225,
      oldWeight: 225,
      currentReps: 7,
      oldReps: 5,
      sets: 2,
      lastWorkout: "4 days ago",
    },
  ];

  function handleChangePage(day: DayData) {
    setSelectedWorkout(day.workout ?? null);
  }

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
          {selectedWorkout === "home" &&
            lifts.map((lift, index) => <DataCard key={index} {...lift} />)}
          {selectedWorkout === "Push" && (
            <>
              <DataCard key={0} {...lifts[0]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
