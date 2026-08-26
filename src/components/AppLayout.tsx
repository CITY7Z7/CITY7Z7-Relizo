import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { localClient as supabase } from "@/integrations/local/client";
import { toast } from "sonner";

function SignOutButton() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-auto">
      <LogOut className="h-4 w-4 mr-2" /> Sign out
    </Button>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border/50 px-4 shrink-0">
            <SidebarTrigger className="mr-3" />
            <SignOutButton />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
