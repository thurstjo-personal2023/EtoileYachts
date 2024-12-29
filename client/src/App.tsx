import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "./pages/AuthPage";
import { BottomTabNavigator } from "./navigation/BottomTabNavigator";
import { useUser } from "./hooks/use-user";
import { LoadingScreen } from "@/components/ui/loading-screen";

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
        <BottomTabNavigator />
      </div>
      <Toaster />
    </>
  );
}

export default App;