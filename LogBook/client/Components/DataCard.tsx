import { useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";

interface DataCardProps {
  id: string;
  name: string;
  type: string;
  currentWeight: number;
  oldWeight: number;
  currentReps: number;
  sets: number;
  lastWorkout: string;
  onLogWorkout: (weight: number, sets: number, reps: number) => void;
  onEditLift: (id: string, name: string, type: string) => Promise<void>;
}

export function DataCard({
  id,
  name,
  type,
  currentWeight,
  oldWeight,
  currentReps,
  sets,
  lastWorkout,
  onLogWorkout,
  onEditLift,
}: DataCardProps) {
  const weightDif = currentWeight - oldWeight;

  const [showLogForm, setShowLogForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newWeight, setNewWeight] = useState(currentWeight.toString());
  const [newSets, setNewSets] = useState(sets.toString());
  const [newReps, setNewReps] = useState(currentReps.toString());
  const [editedName, setEditedName] = useState(name);
  const [editedType, setEditedType] = useState(type ?? "home");
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const handleSave = () => {
    onLogWorkout(
      parseFloat(newWeight) || currentWeight,
      parseInt(newSets) || sets,
      parseInt(newReps) || currentReps
    );
    setShowLogForm(false);
  };

  const handleEditSave = async () => {
    if (!editedName.trim() || !editedType.trim()) {
      setEditError("Name and type are required.");
      return;
    }

    try {
      setIsEditing(true);
      setEditError("");
      await onEditLift(id, editedName.trim(), editedType.trim().toLowerCase());
      setShowEditForm(false);
    } catch (err) {
      console.error("Error updating lift:", err);
      setEditError("Failed to update lift.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (isEditing) return;
    setEditedName(name);
    setEditedType(type ?? "home");
    setEditError("");
    setShowEditForm(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <button
            type="button"
            onClick={() => {
              setEditedName(name);
              setEditedType(type ?? "home");
              setEditError("");
              setShowEditForm((prev) => !prev);
            }}
            className="text-sm px-3 py-1 border rounded-md hover:bg-accent"
          >
            {showEditForm ? "Close" : "Edit"}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {showEditForm && (
            <div className="space-y-2 p-3 border rounded-md bg-muted/30">
              <p className="text-sm font-medium">Edit Lift</p>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Lift name"
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                placeholder="Type"
                className="w-full px-2 py-1 border rounded text-sm"
              />
              {editError && <p className="text-sm text-red-600">{editError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={isEditing}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm disabled:opacity-60"
                >
                  {isEditing ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isEditing}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
                weightDif > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {weightDif > 0 ? "+" : ""}
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
