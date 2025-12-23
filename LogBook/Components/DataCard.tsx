import React from "react";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";

interface DataCardProps {
  name: string;
  currentWeight: number;
  oldWeight: number;
  currentReps: number;
  oldReps: number;
  sets: number;
  lastWorkout: string;
}

export function DataCard({
  name,
  currentWeight,
  oldWeight,
  currentReps,
  oldReps,
  sets,
  lastWorkout,
}: DataCardProps) {
  const weightDif = currentWeight - oldWeight;
  const repsDif = currentReps - oldReps;

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
        </div>
      </CardContent>
    </Card>
  );
}
