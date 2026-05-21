"use client";

import { useState } from "react";

const DEFAULT_INCLUSIONS = [
  "Accommodation",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Airport Transfer",
  "Sightseeing",
  "Guide",
  "Transportation",
  "Permits",
  "Hotel Pickup",
];

const DEFAULT_EXCLUSIONS = [
  "Flights",
  "Visa Fees",
  "Travel Insurance",
  "Personal Expenses",
  "Tips",
  "Alcoholic Drinks",
  "Laundry",
  "Emergency Rescue",
];

export default function Inclusions({
  inclusions,
  exclusions,
  setInclusions,
  setExclusions,
}: any) {
  const [customInc, setCustomInc] = useState("");
  const [customExc, setCustomExc] = useState("");

  const toggleItem = (
    item: string,
    list: string[],
    setter: any
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const addCustom = (
    value: string,
    list: string[],
    setter: any,
    clear: () => void
  ) => {
    if (!value.trim()) return;

    if (!list.includes(value.trim())) {
      setter([...list, value.trim()]);
    }

    clear();
  };

  const Tag = ({
    active,
    children,
    onClick,
  }: any) => (
    <button
      onClick={onClick}
      type="button"
      className={`
        px-3 py-1.5 rounded-full text-sm border transition
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-muted"
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* INCLUSIONS */}
      <div className="bg-white rounded-2xl border p-4 space-y-4">
        <h2 className="font-semibold text-lg">
          Inclusions
        </h2>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_INCLUSIONS.map((item) => (
            <Tag
              key={item}
              active={inclusions.includes(item)}
              onClick={() =>
                toggleItem(
                  item,
                  inclusions,
                  setInclusions
                )
              }
            >
              {item}
            </Tag>
          ))}
        </div>

        {/* Selected Custom Tags */}
        <div className="flex flex-wrap gap-2">
          {inclusions
            .filter(
              (i: string) =>
                !DEFAULT_INCLUSIONS.includes(i)
            )
            .map((item: string) => (
              <Tag
                key={item}
                active={true}
                onClick={() =>
                  toggleItem(
                    item,
                    inclusions,
                    setInclusions
                  )
                }
              >
                {item} ✕
              </Tag>
            ))}
        </div>

        <div className="flex gap-2">
          <input
            value={customInc}
            onChange={(e) =>
              setCustomInc(e.target.value)
            }
            placeholder="Custom inclusion"
            className="flex-1 border rounded-xl px-3 py-2"
          />

          <button
            type="button"
            onClick={() =>
              addCustom(
                customInc,
                inclusions,
                setInclusions,
                () => setCustomInc("")
              )
            }
            className="bg-blue-600 text-white px-4 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

      {/* EXCLUSIONS */}
      <div className="bg-white rounded-2xl border p-4 space-y-4">
        <h2 className="font-semibold text-lg">
          Exclusions
        </h2>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_EXCLUSIONS.map((item) => (
            <Tag
              key={item}
              active={exclusions.includes(item)}
              onClick={() =>
                toggleItem(
                  item,
                  exclusions,
                  setExclusions
                )
              }
            >
              {item}
            </Tag>
          ))}
        </div>

        {/* Selected Custom Tags */}
        <div className="flex flex-wrap gap-2">
          {exclusions
            .filter(
              (i: string) =>
                !DEFAULT_EXCLUSIONS.includes(i)
            )
            .map((item: string) => (
              <Tag
                key={item}
                active={true}
                onClick={() =>
                  toggleItem(
                    item,
                    exclusions,
                    setExclusions
                  )
                }
              >
                {item} ✕
              </Tag>
            ))}
        </div>

        <div className="flex gap-2">
          <input
            value={customExc}
            onChange={(e) =>
              setCustomExc(e.target.value)
            }
            placeholder="Custom exclusion"
            className="flex-1 border rounded-xl px-3 py-2"
          />

          <button
            type="button"
            onClick={() =>
              addCustom(
                customExc,
                exclusions,
                setExclusions,
                () => setCustomExc("")
              )
            }
            className="bg-blue-600 text-white px-4 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}