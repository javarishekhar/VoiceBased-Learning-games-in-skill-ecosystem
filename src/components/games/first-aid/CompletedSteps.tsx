
import { motion } from "framer-motion";

interface CompletedStepsProps {
  completed: string[];
}

export function CompletedSteps({ completed }: CompletedStepsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Completed Steps</h3>
      <ul className="space-y-2">
        {completed.map((step, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center text-green-600"
          >
            <span className="mr-2">✓</span>
            {step}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
