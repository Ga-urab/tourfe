"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import DayList from "@/components/ui/daylist";
import Inclusions from "@/components/ui/inclusions";
import Totals from "@/components/ui/totals";
import PackageSetup from "@/components/ui/packagesetup";
import { generateLabel } from "@/lib/itinerary";
import { DEFAULT_EVENTS } from "@/lib/data";
import { generatePDF } from "@/lib/pdf";

export default function Page() {
  // ─────────────────────────────
  // STATE
  // ─────────────────────────────

  const [days, setDays] = useState<any[]>([
    { title: "Day 1", events: [] },
  ]);

  const [activeDay, setActiveDay] = useState(0);
  const [customEvents, setCustomEvents] = useState<any[]>([]);

  const [inclusions, setInclusions] = useState([
    "Accommodation",
    "Breakfast",
  ]);

  const [exclusions, setExclusions] = useState(["Flights"]);

  const [tourists, setTourists] = useState(2);
  const [margin, setMargin] = useState(10);
  const [operation, setOperation] = useState("multiply");
  const [factor, setFactor] = useState(1);

  const [title, setTitle] = useState(
    "NorthStar Voyage – Tour Itinerary"
  );
  const [tagline, setTagline] = useState("Boundless Journey");

  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [savedPackages, setSavedPackages] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const allEvents = [...DEFAULT_EVENTS, ...customEvents];

  // ─────────────────────────────
  // API
  // ─────────────────────────────

  const API = "http://localhost:3001/itineraries";

  async function saveItinerary(payload: any, id?: string) {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.json();
  }

  async function getItineraries() {
    const res = await fetch(API);
    return res.json();
  }

  async function getItinerary(id: string) {
    const res = await fetch(`${API}/${id}`);
    return res.json();
  }
async function deleteItinerary(id: string) {
  const res = await fetch(`http://localhost:3001/itineraries/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

async function handleDelete(id: string) {
  const ok = confirm("Delete this package?");

  if (!ok) return;

  await deleteItinerary(id);

  // if deleting currently opened package → reset builder
  if (itineraryId === id) {
    setItineraryId(null);
    setTitle("NorthStar Voyage – Tour Itinerary");
    setTagline("Boundless Journey");
    setDays([{ title: "Day 1", events: [] }]);
    setInclusions(["Accommodation", "Breakfast"]);
    setExclusions(["Flights"]);
  }

  await loadPackages();
}
  // ─────────────────────────────
  // LOAD SAVED PACKAGES
  // ─────────────────────────────

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    const data = await getItineraries();
    setSavedPackages(data);
  }

  // ─────────────────────────────
  // ADD EVENT
  // ─────────────────────────────

const addEventToDay = (
  event: any,
  contextType: string | null = null
) => {
  setDays((prev) =>
    prev.map((day, index) => {
      if (index !== activeDay) return day;

      const label = contextType
        ? generateLabel(event.name, contextType)
        : "";

      return {
        ...day,
        events: [
          ...day.events,
          {
            ...event,
            context: contextType
              ? {
                  type: contextType,
                  label,
                }
              : {
                  type: "custom",
                  label: "",
                },
          },
        ],
      };
    })
  );
};

  // ─────────────────────────────
  // TOTALS
  // ─────────────────────────────

  const totals = useMemo(() => {
    const total = days.reduce((sum, day) => {
      return (
        sum +
        day.events.reduce(
          (s: number, e: any) =>
            s + Number(e.cost || 0),
          0
        )
      );
    }, 0);

    let adjusted = total;

    if (operation === "multiply") adjusted = total * factor;
    if (operation === "divide" && factor > 0)
      adjusted = total / factor;
    if (operation === "add") adjusted = total + factor;
    if (operation === "subtract")
      adjusted = total - factor;

    const perPerson =
      tourists > 0 ? adjusted / tourists : adjusted;

    const final =
      perPerson + (perPerson * margin) / 100;

    return {
      total,
      adjusted,
      perPerson,
      final,
    };
  }, [days, tourists, margin, operation, factor]);

  // ─────────────────────────────
  // SAVE / UPDATE
  // ─────────────────────────────

  async function handleSave() {
    setSaving(true);

    const payload = {
      title,
      tagline,
      days,
      inclusions,
      exclusions,
      pricing: totals,
      tourists,
      margin,
      operation,
      factor,
    };

    try {
      const res = await saveItinerary(
        payload,
        itineraryId ?? undefined
      );

      setItineraryId(res._id);
      await loadPackages();
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────
  // LOAD ONE PACKAGE
  // ─────────────────────────────

  async function openPackage(id: string) {
    const data = await getItinerary(id);

    setItineraryId(data._id);

    setTitle(data.title);
    setTagline(data.tagline);

setDays(
  (data.days || []).map((day: any) => ({
    ...day,
    events: (day.events || []).map((e: any) => {
      // already has valid context
      if (e.context?.label || e.context?.type) {
        return e;
      }

      // older saved records without context
      return {
        ...e,
        context: {
          type: "custom",
          label: e.name,
        },
      };
    }),
  }))
);    setInclusions(data.inclusions || []);
    setExclusions(data.exclusions || []);

    setTourists(data.tourists || 1);
    setMargin(data.margin || 0);
    setOperation(data.operation || "multiply");
    setFactor(data.factor || 1);
  }

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  return (
    <div className="flex h-screen bg-muted">
      {/* Sidebar */}
      <Sidebar
        events={allEvents}
        customEvents={setCustomEvents}
        setCustomEvents={setCustomEvents}
        addEventToDay={addEventToDay}
      />

      {/* Main */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">

        {/* Saved Packages */}
        <div className="border rounded-xl bg-white p-3 space-y-2">
          <h3 className="font-semibold text-sm">
            Saved Packages
          </h3>

          {savedPackages.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No packages yet
            </p>
          )}

         {savedPackages.map((p) => (
  <div
    key={p._id}
    className="p-2 border rounded-lg hover:bg-muted"
  >
    <div
      onClick={() => openPackage(p._id)}
      className="cursor-pointer"
    >
      <div className="text-sm font-medium">
        {p.title}
      </div>

      <div className="text-xs text-muted-foreground">
        {new Date(p.createdAt).toLocaleDateString()}
      </div>
    </div>

    <button
      onClick={() => handleDelete(p._id)}
      className="mt-2 text-xs text-red-600 hover:underline"
    >
      Delete
    </button>
  </div>
))}
        </div>

        <PackageSetup
          tourists={tourists}
          setTourists={setTourists}
          margin={margin}
          setMargin={setMargin}
          operation={operation}
          setOperation={setOperation}
          factor={factor}
          setFactor={setFactor}
          title={title}
          setTitle={setTitle}
          tagline={tagline}
          setTagline={setTagline}
        />

        <DayList
          days={days}
          setDays={setDays}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
        />

        <Inclusions
          inclusions={inclusions}
          exclusions={exclusions}
          setInclusions={setInclusions}
          setExclusions={setExclusions}
        />

        <Totals days={days} />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white p-3 rounded-xl"
          >
            {saving
              ? "Saving..."
              : itineraryId
              ? "Update Package"
              : "Save Package"}
          </button>

          <button
            onClick={() =>
              generatePDF(
                days,
                inclusions,
                exclusions,
                totals,
                String(margin),
                title,
                tagline
              )
            }
            className="flex-1 bg-blue-600 text-white p-3 rounded-xl"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}