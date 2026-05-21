"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import axios from "axios";
import { generateLabel } from "@/lib/itinerary";
const API = "http://localhost:3001";

export default function Sidebar({
  addEventToDay,
}: {
  addEventToDay: (event: any, contextType: string | null) => void;
}) {
  const [events, setEvents] = useState<any[]>([]);

  // ─────────────────────────────
  // CONTEXT (NEW)
  // ─────────────────────────────

const contextOptions = [
  { value: "none", label: "No Label" }, // 👈 ADD THIS
  { value: "visit", label: "Visit" },
  { value: "overnight", label: "Overnight" },
  { value: "departure", label: "Departure" },
  { value: "arrival", label: "Arrival" },
  { value: "transfer", label: "Transfer" },
];



  // CREATE STATES
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  // EDIT STATES
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editShortDescription, setEditShortDescription] = useState("");
const [contextType, setContextType] = useState("visit");
  // ─────────────────────────────
  // FETCH
  // ─────────────────────────────
  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // ─────────────────────────────
  // CREATE
  // ─────────────────────────────
  const createActivity = async () => {
    if (!name) return;

    try {
      await axios.post(`${API}/activities`, {
        name,
        cost: Number(cost || 0),
        description,
        shortDescription,
      });

      setName("");
      setCost("");
      setDescription("");
      setShortDescription("");

      fetchActivities();
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────
  // DELETE
  // ─────────────────────────────
  const deleteActivity = async (id: string) => {
    try {
      await axios.delete(`${API}/activities/${id}`);
      fetchActivities();
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────
  // EDIT
  // ─────────────────────────────
  const startEdit = (activity: any) => {
    setEditingId(activity._id);

    setEditName(activity.name);
    setEditCost(String(activity.cost));
    setEditDescription(activity.description || "");
    setEditShortDescription(activity.shortDescription || "");
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      await axios.patch(`${API}/activities/${editingId}`, {
        name: editName,
        cost: Number(editCost || 0),
        description: editDescription,
        shortDescription: editShortDescription,
      });

      setEditingId(null);
      fetchActivities();
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <div className="w-80 border-r bg-white p-4 flex flex-col gap-4">

      {/* HEADER */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Activities
        </h2>
        <p className="text-[11px] text-muted-foreground mt-1">
          Click activity to add into selected day
        </p>
      </div>

      {/* CONTEXT SELECTOR (NEW) */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          Activity Type
        </label>

        <select
          value={contextType}
          onChange={(e) => setContextType(e.target.value)}
          className="w-full border rounded-md p-2 text-sm"
        >
          {contextOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* ACTIVITIES */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {events.map((e: any) => {
          const isEditing = editingId === e._id;

          return (
            <div key={e._id} className="border rounded-xl p-3 space-y-2">

              {isEditing ? (
                <>
                  <Input
                    value={editName}
                    onChange={(ev) => setEditName(ev.target.value)}
                  />

                  <Input
                    type="number"
                    value={editCost}
                    onChange={(ev) => setEditCost(ev.target.value)}
                  />

                  <textarea
                    value={editDescription}
                    onChange={(ev) => setEditDescription(ev.target.value)}
                    className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                  />

                  <textarea
                    value={editShortDescription}
                    onChange={(ev) =>
                      setEditShortDescription(ev.target.value)
                    }
                    className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={saveEdit}>
                      Save
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* ADD TO DAY WITH CONTEXT */}
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
onClick={() =>
  addEventToDay(
    {
      name: e.name,
      cost: e.cost,
      description: e.description,
      shortDescription: e.shortDescription,
    },
    contextType === "none" ? null : contextType
  )
}
                  >
                    <div className="text-left">
                      <div className="font-medium">{e.name}</div>

                      {e.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {e.description}
                        </div>
                      )}

                      {e.shortDescription && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {e.shortDescription}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-primary">
                      ${e.cost}
                    </span>
                  </Button>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => startEdit(e)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => deleteActivity(e._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Create Activity
        </h3>

        <Input
          placeholder="Activity name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
        />

        <Button className="w-full" onClick={createActivity}>
          Add Activity
        </Button>
      </div>
    </div>
  );
}