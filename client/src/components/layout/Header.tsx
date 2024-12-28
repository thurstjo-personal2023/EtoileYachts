import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useUser } from "@/hooks/use-user";
import { HoverWave, FloatingAnchor } from "@/components/ui/maritime-interactions";
import { UserCircle } from "lucide-react";

export function Header() {
  const { user, logout } = useUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">
                  <HoverWave>
                    <div className="flex items-center gap-2">
                      <FloatingAnchor />
                      <img
                        src="/logo.png"
                        alt="Etoile Yachts"
                        className="h-10 w-auto"
                      />
                    </div>
                  </HoverWave>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <HoverWave>
                  <Button variant="ghost">Dashboard</Button>
                </HoverWave>
              </Link>
              <Link href="/profile">
                <HoverWave>
                  <Button variant="ghost" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Button>
                </HoverWave>
              </Link>
              <HoverWave>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </HoverWave>
            </>
          ) : (
            <Link href="/login">
              <HoverWave>
                <Button>Sign In</Button>
              </HoverWave>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}