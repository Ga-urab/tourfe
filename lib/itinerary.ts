export function generateLabel(name: string, type?: string) {
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