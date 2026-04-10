import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { User, Bell, Shield, Globe, Zap, Moon, Sun } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-lg">Manage your account, preferences, and system configuration.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Profile</h3>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Yashwanth Murthy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="yashwanthmurthy2005@gmail.com" disabled />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Preferences Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Preferences</h3>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly summaries and important updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch />
                  <Moon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Intent Detection</Label>
                  <p className="text-sm text-muted-foreground">Automatically route queries to the best agent.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* API & Security Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">API & Security</h3>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value="••••••••••••••••••••••••••••" readOnly className="font-mono" />
                  <Button variant="outline">Rotate Key</Button>
                </div>
                <p className="text-xs text-muted-foreground">Your API key is securely managed by AI Studio.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="pt-4">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account and data.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="destructive">Delete All History</Button>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">Delete Account</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
