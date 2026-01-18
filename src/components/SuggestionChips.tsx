interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  disabled: boolean;
}

const suggestions = [
  "How do I find my dream career?",
  "Help me write a better resume",
  "How to prepare for interviews?",
  "Should I change my career?",
];

export function SuggestionChips({ onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="px-4 py-2 text-sm rounded-full bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-card"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
