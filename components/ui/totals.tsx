export default function Totals({ days }: any) {
  const total = days.reduce(
    (s: number, d: any) =>
      s + d.events.reduce((a: number, e: any) => a + e.cost, 0),
    0
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="p-3 bg-white rounded-xl">
        Total: ${total}
      </div>
    </div>
  );
}