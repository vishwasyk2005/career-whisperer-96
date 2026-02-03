import { useRef, useEffect, useState } from "react";
import { Sparkles, RotateCcw, PanelRightClose, PanelRightOpen, MessageSquare, ClipboardList } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestionChips } from "@/components/SuggestionChips";
import { CareerSnapshot } from "@/components/CareerSnapshot";
import { CareerQuiz } from "@/components/CareerQuiz";
import { useCareerChat } from "@/hooks/useCareerChat";
import { useCareerSnapshot } from "@/hooks/useCareerSnapshot";
import { Button } from "@/components/ui/button";
import { QuizAnswers, CareerSnapshot as CareerSnapshotType } from "@/types/career";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type TabType = "chat" | "quiz";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCareerChat();
  const { snapshot, updateSnapshot, updateFromConversation, resetSnapshot } = useCareerSnapshot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update snapshot when new messages arrive
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      updateFromConversation(lastMessage.content);
    }
  }, [messages, updateFromConversation]);

  const isEmpty = messages.length === 0;

  const handleQuizComplete = (quizSnapshot: CareerSnapshotType, answers: QuizAnswers) => {
    updateSnapshot(quizSnapshot);
    setQuizCompleted(true);
    
    // Create initial message based on quiz answers
    const interests = (answers.interests as string[]) || [];
    const skills = (answers.skills as string[]) || [];
    
    let initialMessage = `I'm a ${answers.education || "student"}`;
    if (answers.degree) initialMessage += ` studying ${answers.degree}`;
    initialMessage += ".";
    
    if (skills.length > 0) {
      initialMessage += ` I have skills in ${skills.slice(0, 3).join(", ")}`;
      if (skills.length > 3) initialMessage += ` and ${skills.length - 3} more`;
      initialMessage += ".";
    }
    
    if (interests.length > 0) {
      initialMessage += ` I'm interested in ${interests.slice(0, 2).join(" and ")}.`;
    }
    
    if (answers.goal) {
      initialMessage += ` My goal is to ${answers.goal}.`;
    }
    
    initialMessage += " Can you help me figure out the best career path and what I should focus on?";
    
    // Switch to chat and send the message
    setActiveTab("chat");
    sendMessage(initialMessage);
  };

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
  };

  const handleClearChat = () => {
    clearMessages();
    resetSnapshot();
  };

  const handleFeedback = (index: number, feedback: "up" | "down") => {
    console.log(`Message ${index} received ${feedback} feedback`);
  };

  // Hide panel by default on mobile
  useEffect(() => {
    if (isMobile) setShowPanel(false);
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Area */}
      <div className={cn(
        "flex flex-col flex-1 min-h-screen transition-all duration-300",
        showPanel && !isMobile ? "mr-80" : ""
      )}>
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">CareerGuide AI</h1>
                <p className="text-xs text-muted-foreground">Your personal career counselor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "chat" && !isEmpty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPanel(!showPanel)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPanel ? (
                  <PanelRightClose className="w-5 h-5" />
                ) : (
                  <PanelRightOpen className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "gap-2 rounded-md transition-all",
                  activeTab === "chat" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("quiz")}
                className={cn(
                  "gap-2 rounded-md transition-all",
                  activeTab === "quiz" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ClipboardList className="w-4 h-4" />
                Career Quiz
                {quizCompleted && (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {activeTab === "quiz" ? (
              /* Quiz Tab */
              <div className="animate-fade-in">
                {quizCompleted ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <ClipboardList className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Quiz Completed!</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Your career profile has been created. Check the Career Snapshot panel 
                      to see your profile, or chat with the AI for personalized guidance.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleRetakeQuiz}>
                        Retake Quiz
                      </Button>
                      <Button onClick={() => setActiveTab("chat")} className="gradient-hero text-primary-foreground">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Go to Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center pt-6">
                    <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-6 shadow-soft">
                      <ClipboardList className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3 text-center">
                      Career Assessment Quiz
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-8 text-center">
                      Answer a few questions to help us understand your background and provide 
                      personalized career recommendations.
                    </p>
                    <CareerQuiz 
                      onComplete={handleQuizComplete} 
                      onSkip={() => setActiveTab("chat")} 
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Chat Tab */
              <>
                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mb-6 shadow-soft">
                      <Sparkles className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
                      Your Career Journey Starts Here
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-4">
                      I'm your AI career counselor. Ask me anything about career paths, 
                      resumes, interviews, or professional growth.
                    </p>
                    {!quizCompleted && (
                      <p className="text-sm text-primary mb-6">
                        💡 Take the <button onClick={() => setActiveTab("quiz")} className="underline font-medium hover:no-underline">Career Quiz</button> for personalized recommendations
                      </p>
                    )}
                    <SuggestionChips onSelect={sendMessage} disabled={isLoading} />
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((msg, i) => (
                      <ChatMessage
                        key={i}
                        role={msg.role}
                        content={msg.content}
                        isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
                        onFeedback={(feedback) => handleFeedback(i, feedback)}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Input Area - Only show in chat tab */}
        {activeTab === "chat" && (
          <footer className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4">
            <div className="max-w-3xl mx-auto px-4">
              <ChatInput onSend={sendMessage} isLoading={isLoading} />
              <p className="text-center text-xs text-muted-foreground mt-3">
                Powered by NLP • AI responses are for guidance only
              </p>
            </div>
          </footer>
        )}
      </div>

      {/* Right Side Panel - Career Snapshot */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-background border-l border-border p-4 overflow-y-auto transition-transform duration-300 z-20",
          showPanel ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-16">
          <CareerSnapshot snapshot={snapshot} onUpdate={updateSnapshot} />
          
          {/* Quick actions */}
          <div className="mt-6 space-y-3">
            {!quizCompleted && (
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("quiz")}
              >
                <ClipboardList className="w-4 h-4" />
                Take Career Quiz
              </Button>
            )}
          </div>
          
          {/* Quick tips */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h4 className="font-medium text-sm text-foreground mb-2">💬 Quick Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• Tell me about your skills and interests</li>
              <li>• Ask about career paths in your field</li>
              <li>• Get resume and interview tips</li>
              <li>• Discuss skill gaps to work on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
