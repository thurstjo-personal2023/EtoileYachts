import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import YachtListingPage from "./pages/YachtListingPage";
import YachtDetailPage from "./pages/YachtDetailPage";
import BookingPage from "./pages/BookingPage";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/yachts" component={YachtListingPage} />
        <Route path="/yachts/:id" component={YachtDetailPage} />
        <Route path="/booking/:id" component={BookingPage} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
