import React from "react";
import { Link } from "react-router-dom";
import { AGENTS } from "../constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronRight, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, Yashwanth</h2>
        <p className="text-muted-foreground text-lg">
          Select an agent to start your next project or task.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/chat/${agent.id}`}>
              <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <agent.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{agent.id}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-primary">
                      <Sparkles className="w-3 h-3" />
                      AI Powered
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 group-hover:translate-x-1 transition-transform">
                      Start Chat <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground overflow-hidden relative border-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 fill-current" />
            Unlock Multi-Agent Research
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg max-w-2xl">
            Upgrade to Pro to access our most advanced agents and coordinate multiple AI models for complex research and reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" size="lg" className="font-semibold">
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
