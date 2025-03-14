
import { useState, useEffect, useRef } from "react";

interface AnimationProps {
  animation: string;
  isPlaying: boolean;
}

export const Animation = ({ animation, isPlaying }: AnimationProps) => {
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isPlaying) {
      let frameCount = 0;
      
      const animate = () => {
        frameCount++;
        if (frameCount <= 60) {  // Run for 60 frames (~1 second at 60fps)
          setFrame(frameCount);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);
  
  // Each animation has a different color and transformation
  const getAnimationStyle = () => {
    const intensity = Math.min(frame / 30, 1);
    
    switch (animation) {
      case "blueprint":
        return {
          backgroundColor: `rgba(100, 149, 237, ${intensity * 0.7})`,
          transform: `scale(${1 + intensity * 0.2})`,
        };
      case "measure":
        return {
          backgroundColor: `rgba(255, 222, 173, ${intensity * 0.7})`,
          transform: `scaleX(${1 + intensity * 0.5})`,
        };
      case "cut":
        return {
          backgroundColor: `rgba(240, 128, 128, ${intensity * 0.7})`,
          transform: `skewX(${intensity * 10}deg)`,
        };
      case "shape":
        return {
          backgroundColor: `rgba(222, 184, 135, ${intensity * 0.7})`,
          borderRadius: `${intensity * 20}%`,
        };
      case "drill":
        return {
          backgroundColor: `rgba(169, 169, 169, ${intensity * 0.7})`,
          transform: `rotate(${intensity * 360}deg)`,
        };
      case "assemble":
        return {
          backgroundColor: `rgba(144, 238, 144, ${intensity * 0.7})`,
          transform: `translate(${intensity * 10}px, ${-intensity * 10}px)`,
        };
      case "hammer":
        return {
          backgroundColor: `rgba(210, 180, 140, ${intensity * 0.7})`,
          transform: `translateY(${Math.sin(frame * 0.3) * 10}px)`,
        };
      case "polish":
        return {
          backgroundColor: `rgba(255, 215, 0, ${intensity * 0.7})`,
          boxShadow: `0 0 ${intensity * 20}px rgba(255, 215, 0, ${intensity})`,
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-lg mb-4">
      <div
        className="absolute w-16 h-16 transition-all duration-100"
        style={getAnimationStyle()}
      ></div>
      <div className="absolute top-2 left-2 text-xs text-gray-600">
        {animation ? animation.charAt(0).toUpperCase() + animation.slice(1) : ""}
      </div>
    </div>
  );
};
