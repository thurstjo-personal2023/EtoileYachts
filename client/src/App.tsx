import { StrictMode } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "./pages/AuthPage";
import { BottomTabNavigator } from "./navigation/BottomTabNavigator";
import { useUser } from "./hooks/use-user";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { MobileLayout } from "@/components/layout/MobileLayout";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <MobileLayout>
          <Switch>
            <Route path="/home" component={() => <div>Home Page</div>} />
            <Route path="/search" component={() => <div>Search Page</div>} />
            <Route path="/bookings" component={() => <div>Bookings Page</div>} />
            <Route path="/profile" component={() => <div>Profile Page</div>} />
          </Switch>
        </MobileLayout>
      </div>
      <Toaster />
    </>
  );
}

export default App;