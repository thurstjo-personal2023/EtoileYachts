import { Switch, Route } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "./hooks/use-user";

// Pages
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
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/yachts" component={YachtListingPage} />
      <Route path="/yachts/:id" component={YachtDetailPage} />
      <Route path="/booking/:id" component={BookingPage} />
      <Route>
        {() => (
          <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="pt-6">
                <div className="flex mb-4 gap-2">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  The page you're looking for doesn't exist.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </Route>
    </Switch>
  );
}

export default App;