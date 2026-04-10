import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AGENTS } from "../constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MoreVertical, 
  RefreshCw, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Bot,
  User as UserIcon,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedAgent = AGENTS.find(a => a.id === agentId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          agentId: agentId,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        agentId: data.agentId,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to history
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.slice(0, 40) + (input.length > 40 ? "..." : ""),
          agentId: data.agentId,
          lastMessage: data.response.slice(0, 100),
          messages: [...messages, userMessage, assistantMessage],
        }),
      });

      if (!agentId && data.agentId) {
        toast.info(`Intent detected: Routing to ${AGENTS.find(a => a.id === data.agentId)?.name || data.agentId}`);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Chat Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {selectedAgent ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <selectedAgent.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{selectedAgent.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Active Agent</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Super Hub</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Auto Intent Detection</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMessages([])}>Clear Chat</DropdownMenuItem>
              <DropdownMenuItem>Export Transcript</DropdownMenuItem>
              <DropdownMenuItem>Agent Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                {selectedAgent ? <selectedAgent.icon className="w-8 h-8 text-primary" /> : <Bot className="w-8 h-8 text-primary" />}
              </div>
              <h2 className="text-2xl font-bold">How can I help you today?</h2>
              <p className="text-muted-foreground max-w-md">
                {selectedAgent 
                  ? `I'm your ${selectedAgent.name}. ${selectedAgent.description}`
                  : "I'm the AI Super Hub. I can automatically detect your intent and route you to the best specialized agent for your task."
                }
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-6">
                {["Summarize this meeting", "Create a sales pitch", "Analyze these metrics", "Review my code"].map((suggestion) => (
                  <Button 
                    key={suggestion} 
                    variant="outline" 
                    className="justify-start text-sm h-auto py-3 px-4"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="w-8 h-8 shrink-0 border border-border">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {message.agentId ? (
                          React.createElement(AGENTS.find(a => a.id === message.agentId)?.icon || Bot, { className: "w-4 h-4" })
                        ) : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div className={cn(
                  "flex flex-col gap-2 max-w-[85%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm shadow-sm",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/50 border border-border rounded-tl-none"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 px-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => copyToClipboard(message.content)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 shrink-0 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary animate-pulse">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-muted/30 rounded-2xl border border-border p-2 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
              <Paperclip className="w-5 h-5 opacity-60" />
            </Button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : "Ask anything..."}
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-sm min-h-[40px] max-h-[200px]"
              rows={1}
            />
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                <Mic className="w-5 h-5 opacity-60" />
              </Button>
              <Button 
                size="icon" 
                className={cn(
                  "h-10 w-10 rounded-xl transition-all",
                  input.trim() ? "bg-primary scale-100" : "bg-muted opacity-50 scale-90"
                )}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
