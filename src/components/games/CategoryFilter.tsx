
import React from "react";
import { Button } from "@/components/ui/button";
import { Baby, GraduationCap, Hammer } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  // Animation variants for the filter buttons
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Button 
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
          className={`px-6 ${activeCategory === "all" ? "bg-gradient-to-r from-primary to-blue-600" : ""}`}
        >
          All Games
        </Button>
      </motion.div>
      
      <motion.div variants={item}>
        <Button 
          variant={activeCategory === "education" ? "default" : "outline"}
          onClick={() => setActiveCategory("education")}
          className={`flex items-center gap-2 ${activeCategory === "education" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}`}
        >
          <GraduationCap className="w-4 h-4" />
          Education
        </Button>
      </motion.div>
      
      <motion.div variants={item}>
        <Button 
          variant={activeCategory === "skills" ? "default" : "outline"}
          onClick={() => setActiveCategory("skills")}
          className={`flex items-center gap-2 ${activeCategory === "skills" ? "bg-gradient-to-r from-green-600 to-emerald-600" : ""}`}
        >
          <Hammer className="w-4 h-4" />
          Skills Training
        </Button>
      </motion.div>
      
      <motion.div variants={item}>
        <Button 
          variant={activeCategory === "kids" ? "default" : "outline"}
          onClick={() => setActiveCategory("kids")}
          className={`flex items-center gap-2 ${activeCategory === "kids" ? "bg-gradient-to-r from-pink-500 to-rose-500" : ""}`}
        >
          <Baby className="w-4 h-4" />
          Kids Games
        </Button>
      </motion.div>
    </motion.div>
  );
};
