
import { Hammer, Ruler, Scissors, PaintBucket, Cylinder, Drill, Wrench, SandTimer } from "lucide-react";

// Define the carpentry steps based on the requested flow
export const carpentrySteps = [
  {
    id: "blueprint",
    name: "Read Blueprint",
    details: "View and understand the blueprint before starting",
    tools: ["blueprint", "glasses"],
    command: "show me the blueprint",
    icon: Cylinder,
    animation: "blueprint"
  },
  {
    id: "measure",
    name: "Measure Wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    command: "measure 10 inches",
    icon: Ruler,
    animation: "measure"
  },
  {
    id: "cut",
    name: "Cut Wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    command: "cut the wood",
    icon: Scissors,
    animation: "cut"
  },
  {
    id: "shape",
    name: "Shape Edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    command: "smooth the edges",
    icon: SandTimer,
    animation: "shape"
  },
  {
    id: "drill",
    name: "Drill Holes",
    details: "Drill holes for screws or nails",
    tools: ["drill", "drill bits"],
    command: "drill the holes",
    icon: Drill,
    animation: "drill"
  },
  {
    id: "assemble",
    name: "Assemble Parts",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    command: "assemble the parts",
    icon: Wrench,
    animation: "assemble"
  },
  {
    id: "secure",
    name: "Secure with Nails",
    details: "Hammer in nails to secure the assembly",
    tools: ["hammer", "nails"],
    command: "hammer the nails",
    icon: Hammer,
    animation: "hammer"
  },
  {
    id: "finish",
    name: "Apply Finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    command: "apply polish",
    icon: PaintBucket,
    animation: "polish"
  }
];

export type CarpentryStep = typeof carpentrySteps[0];
