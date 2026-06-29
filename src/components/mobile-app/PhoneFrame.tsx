import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Phone frame wrapper used to preview mobile app screens on desktop.
 * On small screens (≤480px) it renders full-bleed with no frame.
 *
 * Scopes the Walpay brand-blue palette (matching the W pagos logo) so that
 * /app screens stay coherent with the logo while the rest of the product
 * keeps its own theme.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className="mobile-app-scope min-h-screen bg-muted/40 flex items-center justify-center p-0 sm:p-6"
      style={
        {
          // Brand blue from the W pagos logo (#004684)
          "--primary": "210 100% 26%",
          "--primary-foreground": "0 0% 100%",
          "--primary-glow": "210 70% 42%",
          "--secondary": "210 40% 96%",
          "--secondary-foreground": "210 100% 20%",
          "--accent": "210 40% 96%",
          "--accent-foreground": "210 100% 20%",
          "--ring": "210 100% 26%",
        } as React.CSSProperties
      }
    >
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
