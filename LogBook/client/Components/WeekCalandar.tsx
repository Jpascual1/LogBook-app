import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export type DayData = {
  day: string;
  workout: string;
};

interface WeekCalandarProps {
  week: DayData[];
  onChangePage: (day: DayData) => void;
}

export function WeekCalandar({ week, onChangePage }: WeekCalandarProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {week.map((day) => (
        <Card
          key={day.day}
          onClick={() => onChangePage(day)}
          className="min-h-[150px] cursor-pointer transition hover:border-primary hover:shadow-sm"
        >
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm">{day.day}</CardTitle>
          </CardHeader>

          <CardContent className="text-sm">
            {day.workout ?? "Rest Day"}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
