import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { LayoutDashboard, Package, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavBar() {
  return (
    <div className=" flex justify-between w-full items-center p-3 border-b-2 border-[#262628] rounded-md">
      <div className="text-white">
        {/* <Image
          src={"/images-ai-logo.png"}
          alt="logo"
          width={200}
          height={200}
          className="rounded"
        /> */}
        
        <Link href="/">
          <span className=" bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent text-3xl ml-4 cursor-pointer hover:opacity-80 transition-opacity">
            <strong>Images-ai</strong>
          </span>
        </Link>
      </div>
      <div className="mr-3 flex  max-w-3xl items-center space-x-3">
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/packs">
                <DropdownMenuItem className="cursor-pointer">
                  <Package className="w-4 h-4 mr-2" />
                  Prompt Packs
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        
        <div className="">
          <ModeToggle />
        </div>
        <div className="">
          <SignedOut>
            <Button variant={"ghost"} className="cursor-pointer">
              <SignInButton />
            </Button>
          </SignedOut>

          <SignedOut>
            <Button variant={"ghost"} className="cursor-pointer">
              <SignUpButton />
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
