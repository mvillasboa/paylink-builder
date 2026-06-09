import { Outlet } from "react-router-dom";
import { PhoneFrame } from "./PhoneFrame";
import { MobileTabBar } from "./MobileTabBar";

export function MobileAppLayout() {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <MobileTabBar />
      </div>
    </PhoneFrame>
  );
}
