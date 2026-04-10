import React from "react";
import { useParams, Link } from "react-router-dom";
import { AGENTS } from "../constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MessageSquare, ChevronLeft, Sparkles, Shield, Zap, Info } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

export default function AgentDetails() {
  const { agentId } = useParams();
  const agent = AGENTS.find(a => a.id === agentId);

  if (!agent) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Agent not found</h2>
        <Button asChild variant="link" className="mt-4">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link to="/dashboard">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
          <agent.icon className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold tracking-tight">{agent.name}</h2>
              <Badge className="bg-primary/10 text-primary border-none">v1.2.0</Badge>
            </div>
            <p className="text-xl text-muted-foreground">{agent.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to={`/chat/${agent.id}`}>
                <MessageSquare className="w-5 h-5" /> Start Conversation
              </Link>
            </Button>
            <Button variant="outline" size="lg">View Documentation</Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">Deep context understanding for complex queries.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">Structured output generation (JSON, Markdown, CSV).</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">Integration with file uploads for RAG analysis.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Safety & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">Enterprise-grade encryption for all data.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">No training on your private data.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm">Strict adherence to compliance policies.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Simply type your request in the chat interface. You can also upload relevant files (PDFs, CSVs) to provide context. The agent will analyze your input and return a structured response tailored to your specific needs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
