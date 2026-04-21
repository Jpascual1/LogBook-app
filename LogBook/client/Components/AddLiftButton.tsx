import { useState } from "react";

interface NewLiftData {
  name: string;
  weight: number;
  reps: number;
  sets: number;
  type: string;
}

interface AddLiftButtonProps {
  defaultType: string;
  onSubmit: (lift: NewLiftData) => Promise<void>;
}

export function AddLiftButton({ defaultType, onSubmit }: AddLiftButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [type, setType] = useState(defaultType || "home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setWeight("");
    setReps("");
    setSets("");
    setType(defaultType || "home");
    setError("");
  };

  const openModal = () => {
    setType(defaultType || "home");
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedWeight = Number(weight);
    const parsedReps = Number(reps);
    const parsedSets = Number(sets);

    if (!name.trim() || !type.trim()) {
      setError("Name and type are required.");
      return;
    }

    if (!parsedWeight || !parsedReps || !parsedSets) {
      setError("Weight, reps, and sets are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onSubmit({
        name: name.trim(),
        weight: parsedWeight,
        reps: parsedReps,
        sets: parsedSets,
        type: type.trim().toLowerCase(),
      });

      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error adding lift:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add lift. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          + Add Lift
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-background border border-border p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Add New Lift</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lift name"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight"
                  className="px-3 py-2 border rounded-md bg-background"
                />
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Reps"
                  className="px-3 py-2 border rounded-md bg-background"
                />
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="Sets"
                  className="px-3 py-2 border rounded-md bg-background"
                />
              </div>

              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Type (push, pull, legs...)"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save Lift"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border rounded-md disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
