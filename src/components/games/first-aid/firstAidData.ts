
export interface FirstAidStep {
  name: string;
  details: string;
  equipment: string[];
  animation: string;
  alt: string;
}

export const firstAidSteps: FirstAidStep[] = [
  {
    name: "Check the scene",
    details: "Ensure the area is safe for you and the victim",
    equipment: ["gloves", "mask"],
    animation: "/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png",
    alt: "Person checking the scene at an accident"
  },
  {
    name: "Call emergency services",
    details: "Dial emergency number and provide location and situation",
    equipment: ["phone"],
    animation: "/lovable-uploads/a7e4566d-c0fb-49f6-836c-d32c54f62356.png",
    alt: "Calling emergency services with ambulance"
  },
  {
    name: "Check breathing",
    details: "Look, listen, and feel for breathing",
    equipment: ["none"],
    animation: "/lovable-uploads/b4557cb3-305b-4621-b50d-e6d45f262676.png",
    alt: "Checking breathing of injured person"
  },
  {
    name: "Control bleeding",
    details: "Apply direct pressure to wounds",
    equipment: ["bandages", "gauze", "gloves"],
    animation: "/lovable-uploads/654bba0c-ea62-40b4-9994-f6b6f3254ca7.png",
    alt: "Controlling bleeding with pressure and bandages"
  },
  {
    name: "Treat for shock",
    details: "Keep patient warm and elevate legs if possible",
    equipment: ["blanket"],
    animation: "/lovable-uploads/4775dbcd-59eb-49ca-934a-3ab0da49d601.png",
    alt: "Treating patient for shock"
  },
  {
    name: "Monitor health condition",
    details: "Check pulse, breathing, and consciousness regularly",
    equipment: ["watch", "notepad"],
    animation: "/lovable-uploads/405dfeb1-1ee5-4881-a72e-999f41b63715.png",
    alt: "Monitoring vital signs with medical equipment"
  }
];

// Voice commands illustration image
export const voiceCommandsImage = "/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png";
