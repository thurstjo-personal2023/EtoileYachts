import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-brand-light flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-48 h-48 mb-8">
        {/* Yacht SVG */}
        <svg
          className="w-full h-full text-brand-primary animate-float"
          viewBox="0 0 512 512"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M432 288c-5.5 0-10.7.9-15.8 2.3L350.7 248c11.7-13.9 19.3-31.3 19.3-50.7V32c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v165.3c0 19.4 7.7 36.8 19.3 50.7l-65.5 42.3c-5.1-1.4-10.3-2.3-15.8-2.3C35.8 288 0 323.8 0 368v80c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-80c0-44.2-35.8-80-80-80zM192 64h128v128H192V64z"/>
        </svg>
        {/* Animated waves */}
        <div className="absolute -bottom-4 left-0 right-0 h-24">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
      <h2 className="font-display text-2xl text-brand-dark mb-2">Setting Sail</h2>
      <p className="text-brand-dark/60 text-sm">Preparing your luxury experience</p>
    </div>
  );
}
