import { useState } from 'react';
import { useLocation, Link } from "wouter";
import { Home, Compass, Calendar, User, LifeBuoy, Bell } from 'lucide-react';
import { Route, Switch } from "wouter";

// Import pages
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import BookingsPage from '@/pages/BookingsPage';
import ProfilePage from '@/pages/ProfilePage';
import SupportPage from '@/pages/SupportPage';
import NotificationsPage from '@/pages/NotificationsPage';

const tabs = [
  { name: 'Home', path: '/', icon: Home, component: HomePage },
  { name: 'Explore', path: '/explore', icon: Compass, component: ExplorePage },
  { name: 'Bookings', path: '/bookings', icon: Calendar, component: BookingsPage },
  { name: 'Profile', path: '/profile', icon: User, component: ProfilePage },
  { name: 'Support', path: '/support', icon: LifeBuoy, component: SupportPage },
  { name: 'Notifications', path: '/notifications', icon: Bell, component: NotificationsPage },
];

export function BottomTabNavigator() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-screen">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Switch>
          {tabs.map(({ path, component: Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
        </Switch>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around bg-background border-t border-border h-16 shrink-0">
        {tabs.map(({ name, path, icon: Icon }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <div className={`flex flex-col items-center justify-center p-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}