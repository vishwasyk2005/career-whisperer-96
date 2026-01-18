import { useRef, useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestionChips } from "@/components/SuggestionChips";
import { useCareerChat } from "@/hooks/useCareerChat";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCareerChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
          {!isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
              <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mb-6 shadow-soft">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
                Your Career Journey Starts Here
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                I'm your AI career counselor. Ask me anything about career paths, 
                resumes, interviews, or professional growth.
              </p>
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
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <p className="text-center text-xs text-muted-foreground mt-3">
            Powered by NLP • AI responses are for guidance only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
