import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DayCard({
  day,
  index,
  days,
  setDays,
  activeDay,
  setActiveDay,
}: any) {
  const updateTitle = (val: string) => {
    const updated = [...days];
    updated[index].title = val;
    setDays(updated);
  };

  const removeEvent = (ei: number) => {
    const updated = [...days];
    updated[index].events.splice(ei, 1);
    setDays(updated);
  };

  return (
    <div
      className={`border rounded-xl p-3 bg-white ${
        activeDay === index ? "border-blue-500" : ""
      }`}
    >
      <div className="flex gap-2 items-center mb-2">
        <span className="text-xs font-bold text-blue-600">
          Day {index + 1}
        </span>

        <Input
          value={day.title}
          onChange={(e) => updateTitle(e.target.value)}
        />

        <Button size="sm" onClick={() => setActiveDay(index)}>
          Select
        </Button>
      </div>

      {day.events.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No activities yet
        </p>
      )}

      {day.events.map((e: any, i: number) => (
        <div
          key={i}
          className="flex justify-between text-sm border p-2 rounded mt-2"
        >
          <div>
<p>{e.context?.label || e.name}</p>            <p className="text-xs text-muted-foreground">
              {e.desc}
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeEvent(i)}
          >
            X
          </Button>
        </div>
      ))}
    </div>
  );
}