import Image from "next/image";
import { Button } from "./ui/button";
import DarkLight from "./DarkLight";
import Link from "next/link";
import { LogInIcon } from "lucide-react";

export default function Header() {
  return (
    <header className=" relative top-2 bg-background z-500  mx-2  max-w-4xl sm:mx-auto sm:py-1 sm:px-6 px-2 border rounded-lg shadow-sm">
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/rf.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-20 sm:w-30"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="text-sm rounded-full px-3 sm:px-6"
            >
              Login
              <LogInIcon className="size-4" />
            </Button>
          </Link>

          <DarkLight />
        </div>
      </div>
    </header>
  );
}
