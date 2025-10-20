import { ModeToggle } from "@/components/ModeToggle";
import { plusJakarta } from "../../layout";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function NavbarComponent() {
  return (
    <header
      className={`${plusJakarta.className} sticky top-0 z-50 w-full border-b bg-background`}
    >
      <div className="container flex justify-between min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
          <div className="flex flex-col gap-2 md:flex-row">
            <span>Dashboard Analytics</span>
            <span>Runrikmer</span>
          </div>
        </Link>

        <div className="flex items-center gap-6 justify-evenly">
          <ModeToggle />
          <div className="flex items-center gap-2">
            <Bell />
            <p>gk tau apa lagi</p>
          </div>
        </div>
      </div>
    </header>
  );
}
