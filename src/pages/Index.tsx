import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { QuizGame } from "@/components/QuizGame";

const Index = () => {
  return (
    <VoiceProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-primary">
            Voice Learning Game
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Speak your answers to play the quiz!
          </p>
          
          <QuizGame />
          <VoiceIndicator />
        </div>
      </div>
    </VoiceProvider>
  );
};

export default Index;