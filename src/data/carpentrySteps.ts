
import { Hammer, Ruler, Scissors, PaintBucket, Cylinder, Wrench, Drill, Clock } from "lucide-react";

// Define the carpentry steps based on the requested flow
export const carpentrySteps = [
  {
    id: "blueprint",
    name: "Read Blueprint",
    details: "View and understand the blueprint before starting",
    tools: ["blueprint", "glasses"],
    command: "show me the blueprint",
    icon: Cylinder,
    animation: "blueprint",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/532/original/blueprint-scrolling-looping.mp4"
  },
  {
    id: "measure",
    name: "Measure Wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    command: "measure 10 inches",
    icon: Ruler,
    animation: "measure",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/046/504/original/P1030768.mp4"
  },
  {
    id: "cut",
    name: "Cut Wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    command: "cut the wood",
    icon: Scissors,
    animation: "cut",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/038/640/original/carpenter-sawing-wood-plank.mp4"
  },
  {
    id: "shape",
    name: "Shape Edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    command: "smooth the edges",
    icon: Clock,
    animation: "shape",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/046/138/original/P1030397.mp4"
  },
  {
    id: "drill",
    name: "Drill Holes",
    details: "Drill holes for screws or nails",
    tools: ["drill", "drill bits"],
    command: "drill the holes",
    icon: Drill,
    animation: "drill",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/010/original/drill-a-hole.mp4"
  },
  {
    id: "assemble",
    name: "Assemble Parts",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    command: "assemble the parts",
    icon: Wrench,
    animation: "assemble",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/034/076/original/wood-work-building.mp4"
  },
  {
    id: "secure",
    name: "Secure with Nails",
    details: "Hammer in nails to secure the assembly",
    tools: ["hammer", "nails"],
    command: "hammer the nails",
    icon: Hammer,
    animation: "hammer",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/035/106/original/carpenter-hammering-a-nail-on-a-plank.mp4"
  },
  {
    id: "finish",
    name: "Apply Finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    command: "apply polish",
    icon: PaintBucket,
    animation: "polish",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/038/703/original/painting-wooden-planks.mp4"
  }
];
