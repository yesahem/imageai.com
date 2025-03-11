"use client";
import React, { useState } from "react";
import { Menu } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export function AppBar() {
  return <Navbar className="top-0 " />;
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("w-full ", className)}>
      <Menu setActive={setActive}>
        <div className="flex justify-between w-full">
          <div>hii ther</div>

          <div>hii there2</div>
          <div className="flex space-x-2 p-2 mt-0 border-2 border-red-400 items-center justify-center ">
            <div className="flex space-x-2 p-2 mt-0 border-2 border-rose-400 ">
              <ModeToggle />
              <div className="">
                <SignedOut>
                  <Button variant={"ghost"} className="cursor-pointer">
                    <SignInButton />
                  </Button>
                </SignedOut>
              </div>
              <div className="">
                <SignedOut>
                  <Button variant={"ghost"} className="cursor-pointer">
                    <SignUpButton />
                  </Button>
                </SignedOut>
              </div>
            </div>

            <div className="flex space-x-2 p-2 mt-0 border-2 border-white ">
              <SignedIn>
                <Button className="cursor-pointer">
                  <UserButton />
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
}
