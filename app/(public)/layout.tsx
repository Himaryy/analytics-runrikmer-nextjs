import { ReactNode } from "react";
import NavbarComponent from "./_component/Navbar";
import FooterComponent from "./_component/Footer";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarComponent />
      <main className="flex-1 px-4 md:px-6 lg:px-8 mb-16">{children}</main>
      <FooterComponent />
    </div>
  );
}
