
export interface CarpentryStep {
  name: string;
  details: string;
  tools: string[];
  animation: string;
  alt: string;
}

export const carpentrySteps: CarpentryStep[] = [
  {
    name: "Measure the wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzZiNjBhYjEwNDExMDg2YTNiMDY0NWNiMDI5M2Q1ZTY3YjZjMjZmNyZjdD1n/3o7TKSha51AtNlLOLm/giphy.gif",
    alt: "Measuring wood with tape measure animation"
  },
  {
    name: "Mark cutting lines",
    details: "Use a straight edge and pencil to mark your cuts",
    tools: ["pencil", "straight edge", "square"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjQ5YzE4ZmM3NjFiNGFhOGZkYjM4ODc0YzEzZjY5ZmYzYWI1NjVjZiZjdD1n/3o7TKRnEgJj3NcHivu/giphy.gif",
    alt: "Marking wood cutting lines animation"
  },
  {
    name: "Cut the wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJkYjFkZGYwNGQ0ZWNiOWM4OWY3ZjY5ZWYyYjY4ZjIyZjZhYjhmZCZjdD1n/3o7TKtsBMu4LFhts9O/giphy.gif",
    alt: "Cutting wood with saw animation"
  },
  {
    name: "Sand the edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzM0ZjE0ZmIyYzQ0ZTliYjJkYzE4YjUxMjY3ZGY5YzY0ZjYyNDFjZiZjdD1n/3o7TKRwHq7NLy/giphy.gif",
    alt: "Sanding wood edges animation"
  },
  {
    name: "Assemble pieces",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjY0YzI4ZmE3NjFiNGFhOGZkYjM4ODc0YzEzZjY5ZmYzYWI1NjVjZiZjdD1n/3o7TKGMZHi73yzCumQ/giphy.gif",
    alt: "Assembling wooden pieces animation"
  },
  {
    name: "Apply finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzEyZjE0ZmIyYzQ0ZTliYjJkYzE4YjUxMjY3ZGY5YzY0ZjYyNDFjZiZjdD1n/3o7TKRwHq7NLy/giphy.gif",
    alt: "Applying wood finish animation"
  }
];

// Voice commands illustration image
export const voiceCommandsImage = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJkYjFkZGYwNGQ0ZWNiOWM4OWY3ZjY5ZWYyYjY4ZjIyZjZhYjhmZCZjdD1n/3o7TKtsBMu4LFhts9O/giphy.gif";
