import React, { useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";

interface DataCardProps {
  name: string;
  currentWeight: number;
  oldWeight: number;
  currentReps: number;
  oldReps: number;
  sets: number;
  lastWorkout: string;
  onLogWorkout: (weight: number, sets: number, reps: number) => void;
}

export function DataCard({
  name,
  currentWeight,
  oldWeight,
  currentReps,
  oldReps,
  sets,
  lastWorkout,
  onLogWorkout,
}: DataCardProps) {
  const weightDif = currentWeight - oldWeight;

  const [showLogForm, setShowLogForm] = useState(false);
  const [newWeight, setNewWeight] = useState(currentWeight.toString());
  const [newSets, setNewSets] = useState(sets.toString());
  const [newReps, setNewReps] = useState(currentReps.toString());

  const handleSave = () => {
    onLogWorkout(
      parseFloat(newWeight) || currentWeight,
      parseInt(newSets) || sets,
      parseInt(newReps) || currentReps
    );
    setShowLogForm(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-muted-foreground">Current</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl">{currentWeight}</span>
              <span className="text-muted-foreground">lbs</span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sets × Reps</span>
            <span>
              {sets} × {currentReps}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Previous</span>
            <span>{oldWeight} lbs</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last workout</span>
            <span>{lastWorkout}</span>
          </div>

          {weightDif !== 0 && (
            <div
              className={`text-sm ${
                weightDif ? "text-green-600" : "text-red-600"
              }`}
            >
              {weightDif ? "+" : ""}
              {weightDif} lbs from last time
            </div>
          )}

          {/* Save Workout Section */}
          <div className="pt-3 border-t border-border">
            {!showLogForm ? (
              <button
                onClick={() => setShowLogForm(true)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Log Workout
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Log Today's Workout</p>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Weight"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    value={newSets}
                    onChange={(e) => setNewSets(e.target.value)}
                    placeholder="Sets"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    value={newReps}
                    onChange={(e) => setNewReps(e.target.value)}
                    placeholder="Reps"
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowLogForm(false)}
                    className="px-4 py-2 border rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
