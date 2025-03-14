
import React from "react";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex justify-center gap-3 mb-8">
      <Button 
        variant={activeCategory === "all" ? "default" : "outline"}
        onClick={() => setActiveCategory("all")}
      >
        All Games
      </Button>
      <Button 
        variant={activeCategory === "education" ? "default" : "outline"}
        onClick={() => setActiveCategory("education")}
      >
        Education
      </Button>
      <Button 
        variant={activeCategory === "skills" ? "default" : "outline"}
        onClick={() => setActiveCategory("skills")}
      >
        Skills Training
      </Button>
      <Button 
        variant={activeCategory === "kids" ? "default" : "outline"}
        onClick={() => setActiveCategory("kids")}
        className="flex items-center gap-1"
      >
        <Baby className="w-4 h-4" />
        Kids Games
      </Button>
    </div>
  );
};
