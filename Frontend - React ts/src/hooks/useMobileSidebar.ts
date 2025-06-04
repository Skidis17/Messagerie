
import { useState } from "react";

export const useMobileSidebar = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return {
    mobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar
  };
};
