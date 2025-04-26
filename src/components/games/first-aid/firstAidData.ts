
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
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTk4ZjJiNmE3YzQ0ZTliYjJkYzE4YjUxMjY3ZGY5YzY0ZjYyNDFjZiZjdD1n/3o7TKRnEgJj3NcHivu/giphy.gif",
    alt: "Checking scene safety animation"
  },
  {
    name: "Call emergency services",
    details: "Dial emergency number and provide location and situation",
    equipment: ["phone"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0ZjE0ZmIyYzQ0ZTliYjJkYzE4YjUxMjY3ZGY5YzY0ZjYyNDFjZiZjdD1n/3o7TKRwHq7NLy/giphy.gif",
    alt: "Calling emergency services animation"
  },
  {
    name: "Check breathing",
    details: "Look, listen, and feel for breathing",
    equipment: ["none"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjY0YzI4ZmE3NjFiNGFhOGZkYjM4ODc0YzEzZjY5ZmYzYWI1NjVjZiZjdD1n/3o7TKGMZHi73yzCumQ/giphy.gif",
    alt: "Checking breathing animation"
  },
  {
    name: "Control bleeding",
    details: "Apply direct pressure to wounds",
    equipment: ["bandages", "gauze", "gloves"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJkYjFkZGYwNGQ0ZWNiOWM4OWY3ZjY5ZWYyYjY4ZjIyZjZhYjhmZCZjdD1n/3o7TKtsBMu4LFhts9O/giphy.gif",
    alt: "Controlling bleeding animation"
  },
  {
    name: "Treat for shock",
    details: "Keep patient warm and elevate legs if possible",
    equipment: ["blanket"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzZiNjBhYjEwNDExMDg2YTNiMDY0NWNiMDI5M2Q1ZTY3YjZjMjZmNyZjdD1n/3o7TKSha51AtNlLOLm/giphy.gif",
    alt: "Treating shock animation"
  },
  {
    name: "Monitor health condition",
    details: "Check pulse, breathing, and consciousness regularly",
    equipment: ["watch", "notepad"],
    animation: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjQ5YzE4ZmM3NjFiNGFhOGZkYjM4ODc0YzEzZjY5ZmYzYWI1NjVjZiZjdD1n/3o7TKRnEgJj3NcHivu/giphy.gif",
    alt: "Monitoring vital signs animation"
  }
];

// Voice commands illustration image
export const voiceCommandsImage = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJkYjFkZGYwNGQ0ZWNiOWM4OWY3ZjY5ZWYyYjY4ZjIyZjZhYjhmZCZjdD1n/3o7TKtsBMu4LFhts9O/giphy.gif";
