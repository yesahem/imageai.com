import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export function NavBar() {
  return (
    <div className=" flex justify-between w-full items-center p-3 border-b-2 border-[#262628] rounded-md">
      <div className="text-white">
        <Image
          src={"/images-ai-logo.png"}
          alt="logo"
          width={200}
          height={200}
          className="rounded"
        />
      </div>
      <div className="mr-3 flex  max-w-3xl items-center space-x-3">
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
