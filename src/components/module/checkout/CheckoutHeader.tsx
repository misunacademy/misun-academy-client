import { ArrowLeft, Sparkles } from "lucide-react";

interface CheckoutHeaderProps {
  currentStep: number;
  onBack: () => void;
}

export function CheckoutHeader({ currentStep, onBack }: CheckoutHeaderProps) {
  return (
    <div className="bg-surface/90 backdrop-blur-sm border-b border-primary/15 sticky top-16 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-white/80">
              {currentStep === 1 ? 'Payment Method' : 'Manual Payment'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
