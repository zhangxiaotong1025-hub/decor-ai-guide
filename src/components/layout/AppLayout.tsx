import { Outlet } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";

const AppLayout = () => (
  <div className="h-dvh flex flex-col bg-background">
    <div className="flex-1 overflow-hidden">
      <Outlet />
    </div>
    <BottomTabBar />
  </div>
);

export default AppLayout;
