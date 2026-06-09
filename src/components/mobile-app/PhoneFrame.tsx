import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Phone frame wrapper used to preview mobile app screens on desktop.
 * On small screens (≤480px) it renders full-bleed with no frame.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:w-[390px] sm:h-[844px] bg-background sm:rounded-[3rem] sm:shadow-2xl sm:border-8 sm:border-foreground/90 overflow-hidden relative flex flex-col min-h-screen sm:min-h-0">
        {/* Notch */}
        <div className="hidden sm:flex justify-center pt-2">
          <div className="w-32 h-6 bg-foreground/90 rounded-b-2xl" />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
