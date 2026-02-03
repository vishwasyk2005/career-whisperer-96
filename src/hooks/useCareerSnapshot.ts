import { useState, useCallback } from "react";
import { CareerSnapshot } from "@/types/career";

const defaultSnapshot: CareerSnapshot = {
  education: "Not specified",
  skills: [],
  goal: "Undecided",
  stage: "Unknown",
  gaps: [],
};

export function useCareerSnapshot() {
  const [snapshot, setSnapshot] = useState<CareerSnapshot>(defaultSnapshot);

  const updateSnapshot = useCallback((updates: Partial<CareerSnapshot>) => {
    setSnapshot((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFromConversation = useCallback((content: string) => {
    const lowerContent = content.toLowerCase();
    
    // Extract education info
    const educationPatterns = [
      /(?:studying|pursuing|enrolled in|doing)\s+(?:a\s+)?(.+?)\s+(?:degree|course|program)/i,
      /(?:i'm|i am|currently)\s+(?:a\s+)?(\d+(?:st|nd|rd|th)?\s+year\s+\w+\s+student)/i,
      /(?:b\.?tech|b\.?e|bca|mca|bsc|msc|ba|ma|mba|phd)\s+(?:in\s+)?(\w+)/i,
      /(?:cse|cs|it|ece|eee|mechanical|civil|chemical)/i,
    ];
    
    for (const pattern of educationPatterns) {
      const match = content.match(pattern);
      if (match) {
        setSnapshot((prev) => ({
          ...prev,
          education: match[0].trim(),
        }));
        break;
      }
    }

    // Extract skills
    const skillKeywords = [
      "python", "java", "javascript", "c++", "c", "sql", "react", "node",
      "machine learning", "ml", "ai", "data science", "web development",
      "android", "ios", "flutter", "django", "flask", "spring",
      "html", "css", "typescript", "aws", "docker", "kubernetes",
      "git", "linux", "excel", "power bi", "tableau"
    ];
    
    const foundSkills = skillKeywords.filter(skill => 
      lowerContent.includes(skill.toLowerCase())
    );
    
    if (foundSkills.length > 0) {
      setSnapshot((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...foundSkills])],
      }));
    }

    // Extract goals
    const goalPatterns = [
      /(?:want to|interested in|goal is to|aspire to|dream of)\s+(?:become|be|work as|pursue)\s+(?:a\s+)?(.+?)(?:\.|,|$)/i,
      /(?:career in|job in|work in)\s+(.+?)(?:\.|,|$)/i,
    ];
    
    for (const pattern of goalPatterns) {
      const match = content.match(pattern);
      if (match) {
        setSnapshot((prev) => ({
          ...prev,
          goal: match[1].trim(),
          stage: "Exploration",
        }));
        break;
      }
    }

    // Detect gaps from context
    const gapPatterns = [
      /(?:don't know|don't have|lack|need to learn|weak in|struggling with)\s+(.+?)(?:\.|,|$)/i,
      /(?:no experience in|haven't learned|need to improve)\s+(.+?)(?:\.|,|$)/i,
    ];
    
    for (const pattern of gapPatterns) {
      const match = content.match(pattern);
      if (match) {
        setSnapshot((prev) => ({
          ...prev,
          gaps: [...new Set([...prev.gaps, match[1].trim()])],
        }));
      }
    }
  }, []);

  const resetSnapshot = useCallback(() => {
    setSnapshot(defaultSnapshot);
  }, []);

  return {
    snapshot,
    updateSnapshot,
    updateFromConversation,
    resetSnapshot,
  };
}
