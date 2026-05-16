import { Switch, Route, Router, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { AuthProvider, useAuth, ROLE_NAV } from "@/contexts/AuthContext";
import { JourneyProvider } from "@/contexts/JourneyContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AppShell } from "@/components/shell/AppShell";

import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Complaints from "@/pages/Complaints";
import Inbox from "@/pages/Inbox";
import VoC from "@/pages/VoC";
import KB from "@/pages/KB";
import Portal from "@/pages/Portal";
import Copilot from "@/pages/Copilot";
import Admin from "@/pages/Admin";
import Audit from "@/pages/Audit";
import Automation from "@/pages/Automation";
import Journeys from "@/pages/Journeys";
import JourneyDetail from "@/pages/JourneyDetail";
import About from "@/pages/About";
import Governance from "@/pages/Governance";
import Programme from "@/pages/Programme";
import AccessDenied from "@/pages/AccessDenied";
import NotFound from "@/pages/not-found";

function Guard({ path, navKey, children }: { path: string; navKey?: string; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  const allowed = new Set(ROLE_NAV[user.role]);
  // Some routes are dynamic (e.g. /journeys/:id) — gate by base navKey instead of exact path.
  const gateKey = navKey ?? path;
  if (!allowed.has(gateKey)) return <AppShell><AccessDenied /></AppShell>;
  return <AppShell>{children}</AppShell>;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  return <Redirect to={user.landing} />;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/landing" component={Landing} />
      <Route path="/about">{() => <Guard path="/about"><About /></Guard>}</Route>
      <Route path="/governance">{() => <Guard path="/governance"><Governance /></Guard>}</Route>
      <Route path="/programme">{() => <Guard path="/programme"><Programme /></Guard>}</Route>
      <Route path="/dashboard">{() => <Guard path="/dashboard"><Dashboard /></Guard>}</Route>
      <Route path="/complaints">{() => <Guard path="/complaints"><Complaints /></Guard>}</Route>
      <Route path="/inbox">{() => <Guard path="/inbox"><Inbox /></Guard>}</Route>
      <Route path="/voc">{() => <Guard path="/voc"><VoC /></Guard>}</Route>
      <Route path="/kb">{() => <Guard path="/kb"><KB /></Guard>}</Route>
      <Route path="/portal">{() => <Guard path="/portal"><Portal /></Guard>}</Route>
      <Route path="/copilot">{() => <Guard path="/copilot"><Copilot /></Guard>}</Route>
      <Route path="/admin">{() => <Guard path="/admin"><Admin /></Guard>}</Route>
      <Route path="/audit">{() => <Guard path="/audit"><Audit /></Guard>}</Route>
      <Route path="/automation">{() => <Guard path="/automation"><Automation /></Guard>}</Route>
      <Route path="/journeys">{() => <Guard path="/journeys"><Journeys /></Guard>}</Route>
      <Route path="/journeys/:id">{() => <Guard path="/journeys" navKey="/journeys"><JourneyDetail /></Guard>}</Route>
      <Route path="/" component={HomeRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AccessibilityProvider>
        <AuthProvider>
          <JourneyProvider>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <AppRouter />
              </Router>
            </TooltipProvider>
          </JourneyProvider>
        </AuthProvider>
        </AccessibilityProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
