import { Check } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";

export function Pricing() {
  return (
    <div className=" mt-40 flex flex-col items-center justify-center ">
      <h1 className="text-3xl font-bold tracking-tight ">
        Simple, transparent pricing
      </h1>

      <h2 className="text-muted-foreground pt-5 text-xl">
        Choose the plan that&apos;s right for you and start generating better
        images today.
      </h2>

      <div className="flex gap-10 mt-14 mr-4 ml-4">
        <div className="flex gap-5">
          <Card className="flex flex-col border border-border">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-4xl font-bold">$0</div>
              <CardDescription>
                Perfect for individuals just getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>25 videos per user</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>5-minute recording limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic editing tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Public link sharing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col border border-border">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-4xl font-bold">$0</div>
              <CardDescription>
                Perfect for individuals just getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>25 videos per user</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>5-minute recording limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic editing tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Public link sharing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col border border-border">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-4xl font-bold">$0</div>
              <CardDescription>
                Perfect for individuals just getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>25 videos per user</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>5-minute recording limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic editing tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Public link sharing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
