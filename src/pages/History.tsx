import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AGENTS } from "../constants";
import { History as HistoryIcon, Search, Trash2, MessageSquare, ChevronRight, Clock } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";

interface HistoryEntry {
  id: string;
  title: string;
  agentId: string;
  lastMessage: string;
  timestamp: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(h => 
    h.title.toLowerCase().includes(search.toLowerCase()) || 
    h.agentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Chat History</h2>
          <p className="text-muted-foreground">Review and continue your previous conversations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-muted/50 rounded-xl" />
            </Card>
          ))
        ) : filteredHistory.length === 0 ? (
          <Card className="border-dashed py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <HistoryIcon className="w-12 h-12 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">No conversations found.</p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/chat">Start a new chat</Link>
              </Button>
            </div>
          </Card>
        ) : (
          filteredHistory.map((entry, index) => {
            const agent = AGENTS.find(a => a.id === entry.agentId);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link to={`/chat/${entry.agentId}`}>
                  <Card className="hover:bg-accent/50 transition-colors group cursor-pointer overflow-hidden">
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {agent ? <agent.icon className="w-6 h-6 text-primary" /> : <MessageSquare className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold truncate">{entry.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{entry.lastMessage}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">
                            {agent?.name || entry.agentId}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
