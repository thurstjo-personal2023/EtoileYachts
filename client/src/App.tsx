import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ServicesPage from "./pages/ServicesPage";
import BookingsPage from "./pages/BookingsPage";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          {!user ? (
            <Route path="*" component={AuthPage} />
          ) : (
            <>
              <Route path="/" component={HomePage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/services" component={ServicesPage} />
              <Route path="/bookings" component={BookingsPage} />
              <Route path="*">
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">404</h1>
                    <p className="mt-2 text-muted-foreground">Page not found</p>
                  </div>
                </div>
              </Route>
            </>
          )}
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
