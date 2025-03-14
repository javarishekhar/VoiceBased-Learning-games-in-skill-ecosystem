
import React from "react";
import { Github, Headphones, Heart } from "lucide-react";

export const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t mt-auto">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Headphones className="w-5 h-5 text-primary mr-2" />
          <p className="text-gray-600 text-sm">
            Voice-controlled games for enhanced learning
          </p>
        </div>
        
        <div className="flex items-center">
          <p className="text-gray-600 text-sm mr-2">
            Made with
          </p>
          <Heart className="w-4 h-4 text-red-500 mr-2" fill="#ef4444" />
          <p className="text-gray-600 text-sm">
            by Shekhar and Vivekananda
          </p>
        </div>
        
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors mt-4 sm:mt-0">
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);
