/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ChatInterface from "./pages/ChatInterface";
import FileUpload from "./pages/FileUpload";
import AgentDetails from "./pages/AgentDetails";
import History from "./pages/History";
import Settings from "./pages/Settings";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="chat/:agentId" element={<ChatInterface />} />
            <Route path="upload" element={<FileUpload />} />
            <Route path="agent/:agentId" element={<AgentDetails />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </TooltipProvider>
  );
}
