
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import { User } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {currentUser ? (
            <Routes>
              <Route 
                path="/" 
                element={<Index currentUser={currentUser} onLogout={handleLogout} />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <AuthScreen onLogin={handleLogin} />
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
