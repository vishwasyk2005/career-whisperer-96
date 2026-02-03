import { useState } from "react";
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuizQuestion, QuizAnswers, CareerSnapshot } from "@/types/career";
import { cn } from "@/lib/utils";

const quizQuestions: QuizQuestion[] = [
  {
    id: "education",
    question: "What are you currently studying?",
    type: "text",
    placeholder: "e.g., B.Tech CSE 2nd year, BCA final year, etc.",
  },
  {
    id: "degree",
    question: "What is your degree/field of study?",
    type: "select",
    options: [
      "Computer Science / IT",
      "Electronics & Communication",
      "Mechanical Engineering",
      "Civil Engineering",
      "Business / MBA",
      "Arts & Humanities",
      "Science (Physics/Chemistry/Math)",
      "Medicine / Healthcare",
      "Other",
    ],
  },
  {
    id: "skills",
    question: "What skills do you have? (Select all that apply)",
    type: "multiselect",
    options: [
      "Python",
      "Java",
      "JavaScript",
      "C/C++",
      "SQL",
      "Machine Learning",
      "Web Development",
      "Mobile Development",
      "Data Analysis",
      "Cloud Computing",
      "UI/UX Design",
      "Project Management",
      "Communication",
      "Problem Solving",
    ],
  },
  {
    id: "interests",
    question: "What areas interest you the most?",
    type: "multiselect",
    options: [
      "Software Development",
      "Data Science & AI",
      "Cybersecurity",
      "Product Management",
      "Entrepreneurship",
      "Research & Academia",
      "Finance & Fintech",
      "Healthcare Tech",
      "Gaming Industry",
      "Content Creation",
    ],
  },
  {
    id: "goal",
    question: "What's your career goal?",
    type: "text",
    placeholder: "e.g., Become a software engineer at a top tech company",
  },
  {
    id: "experience",
    question: "Do you have any work experience?",
    type: "select",
    options: [
      "No experience yet",
      "Internships only",
      "1-2 years",
      "2-5 years",
      "5+ years",
    ],
  },
];

interface CareerQuizProps {
  onComplete: (snapshot: CareerSnapshot, answers: QuizAnswers) => void;
  onSkip: () => void;
}

export function CareerQuiz({ onComplete, onSkip }: CareerQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const isLastStep = currentStep === quizQuestions.length - 1;
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultiSelect = (option: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    handleAnswer(updated);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Convert answers to CareerSnapshot
    const snapshot: CareerSnapshot = {
      education: (answers.education as string) || "Not specified",
      skills: (answers.skills as string[]) || [],
      goal: (answers.goal as string) || "Undecided",
      stage: answers.experience === "No experience yet" ? "Exploration" : 
             answers.experience === "Internships only" ? "Learning" : "Growing",
      gaps: [], // Will be determined by AI during conversation
    };

    setTimeout(() => {
      onComplete(snapshot, answers);
    }, 500);
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return answer.trim().length > 0;
  };

  if (isCompleting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Profile Created!</h3>
        <p className="text-muted-foreground text-center">
          Starting your personalized career guidance...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-hero transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 animate-fade-in" key={currentStep}>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === "text" && (
          <Input
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="text-base"
          />
        )}

        {currentQuestion.type === "select" && (
          <div className="grid gap-2">
            {currentQuestion.options?.map((option) => (
              <Button
                key={option}
                variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                className={cn(
                  "justify-start h-auto py-3 px-4 text-left",
                  answers[currentQuestion.id] === option && "gradient-hero"
                )}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {currentQuestion.type === "multiselect" && (
          <div className="flex flex-wrap gap-2">
            {currentQuestion.options?.map((option) => {
              const selected = ((answers[currentQuestion.id] as string[]) || []).includes(option);
              return (
                <Badge
                  key={option}
                  variant={selected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-2 px-3 text-sm transition-all",
                    selected ? "gradient-hero text-primary-foreground" : "hover:bg-muted"
                  )}
                  onClick={() => handleMultiSelect(option)}
                >
                  {option}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-muted-foreground"
        >
          Skip Quiz
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gap-1 gradient-hero text-primary-foreground"
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-4 h-4" />
              Get Started
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
