interface StepperProps {
  currentStep: number;
}

const steps = [
  'Upload Document',
  'Language Selection',
  'Extract & Translate',
  'Summary',
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-3xl mx-auto py-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-0">
          <div className="flex flex-col items-center">
            <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-4 transition-colors
              ${currentStep === idx ? 'bg-[#6C4EE6] text-white border-[#6C4EE6]' : 'bg-white text-[#6C4EE6] border-[#C3B6F7]'}
            `}>{idx + 1}</div>
            <span className={`mt-2 text-base font-semibold ${currentStep === idx ? 'text-[#6C4EE6]' : 'text-[#C3B6F7]'}`}>{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-16 h-1 bg-gradient-to-r from-[#C3B6F7] to-[#6C4EE6] mx-2 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
} 