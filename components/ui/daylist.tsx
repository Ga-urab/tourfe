import DayCard from "./daycard";
import { Button } from "@/components/ui/button";
const contextOptions = [
  { value: "none", label: "No Label" }, // 👈 ADD THIS
  { value: "visit", label: "Visit" },
  { value: "overnight", label: "Overnight" },
  { value: "departure", label: "Departure" },
  { value: "arrival", label: "Arrival" },
  { value: "transfer", label: "Transfer" },
];
function generateLabel(name: string, type?: string) {
  if (!type) return name;

  switch (type) {
    case "overnight":
      return `Overnight at ${name}`;
    case "departure":
      return `Depart from ${name}`;
    case "arrival":
      return `Arrive at ${name}`;
    case "transfer":
      return `Transfer via ${name}`;
    default:
      return `Visit ${name}`;
  }
}
export default function DayList({
  days,
  setDays,
  activeDay,
  setActiveDay,
}: any) {
  const addDay = () => {
    setDays([...days, { title: `Day ${days.length + 1}`, events: [] }]);
  };

  return (
    <div className="space-y-3">
      {days.map((day: any, i: number) => (
        <DayCard
          key={i}
          day={day}
          index={i}
          days={days}
          setDays={setDays}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
        />
      ))}

      <Button onClick={addDay}>+ Add Day</Button>

      
    </div>
  );
}