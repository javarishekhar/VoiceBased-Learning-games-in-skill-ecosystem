
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
    animation: "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png",
    alt: "Person measuring wood with a tape measure"
  },
  {
    name: "Mark cutting lines",
    details: "Use a straight edge and pencil to mark your cuts",
    tools: ["pencil", "straight edge", "square"],
    animation: "/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png",
    alt: "Marking cutting lines on wood"
  },
  {
    name: "Cut the wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    animation: "/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png",
    alt: "Cutting wood with a saw"
  },
  {
    name: "Sand the edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    animation: "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png",
    alt: "Sanding wood edges"
  },
  {
    name: "Assemble pieces",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    animation: "/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png",
    alt: "Assembling wooden pieces"
  },
  {
    name: "Apply finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    animation: "/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png",
    alt: "Applying finish to wood"
  }
];

// Voice commands illustration image
export const voiceCommandsImage = "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png";
