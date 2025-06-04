import React, { useState } from "react";
import { User } from "../types";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.login(username, password);
      const user = await api.getCurrentUser();
      
      if (user) {
        onLogin(user);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Impossible de récupérer les informations de l'utilisateur."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Nom d'utilisateur ou mot de passe incorrect."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-military-light/30">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="w-full flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-military-dark flex items-center justify-center">
              <Shield className="h-6 w-6 text-military-light" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">Connexion</CardTitle>
          <CardDescription className="text-center">
            Système de messagerie militaire sécurisé
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="username"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              type="submit"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthScreen;
