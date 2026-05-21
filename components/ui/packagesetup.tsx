"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PackageSetupProps {
  tourists: number;
  setTourists: (v: number) => void;

  margin: number;
  setMargin: (v: number) => void;

  operation: string;
  setOperation: (v: string) => void;

  factor: number;
  setFactor: (v: number) => void;

  title: string;
  setTitle: (v: string) => void;

  tagline: string;
  setTagline: (v: string) => void;
}

export default function PackageSetup({
  tourists,
  setTourists,
  margin,
  setMargin,
  operation,
  setOperation,
  factor,
  setFactor,
  title,
  setTitle,
  tagline,
  setTagline,
}: PackageSetupProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 space-y-5 shadow-sm">

      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Package Setup
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure itinerary pricing and package details
        </p>
      </div>

      {/* Package Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Package Title
        </label>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Everest Skies & Kathmandu Heritage"
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tagline / Summary
        </label>

        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Aerial Himalayan Experience..."
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Tourists */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            No. of Tourists
          </label>

          <Input
            type="number"
            min={1}
            value={tourists}
            onChange={(e) =>
              setTourists(Number(e.target.value))
            }
          />
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Margin %
          </label>

          <Input
            type="number"
            min={0}
            value={margin}
            onChange={(e) =>
              setMargin(Number(e.target.value))
            }
          />
        </div>

        {/* Operation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Operation
          </label>

          <Select
            value={operation}
            onValueChange={setOperation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">
                None
              </SelectItem>

              <SelectItem value="divide">
                Divide by
              </SelectItem>

              <SelectItem value="multiply">
                Multiply by
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Factor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Factor
          </label>

          <Input
            type="number"
            min={1}
            value={factor}
            onChange={(e) =>
              setFactor(Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}