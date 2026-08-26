import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { localClient as supabase } from "@/integrations/local/client";
import type { Session } from "@/integrations/local/client";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, Loader2 } from "lucide-react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-primary/10 animate-ping" />
          <div className="h-14 w-14 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground">Loading</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Требуется авторизация</h1>
            <p className="text-muted-foreground text-sm">
              Содержимое доступно только авторизованным пользователям. Войдите, чтобы продолжить.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/auth", { state: { from: location.pathname } })}
          >
            <LogIn className="h-4 w-4 mr-2" /> Войти
          </Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}