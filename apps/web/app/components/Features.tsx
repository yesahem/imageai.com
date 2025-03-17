import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Video } from "lucide-react";

export function Features(){
  return (
    <div className=" mt-40 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Features for better Image Generation
      </h1>

      <h2 className="text-muted-foreground pt-5 text-xl">
        Train and Share images with ease. Save time and get quality photos in
        minutes .
      </h2>

      <div className="flex gap-10 mt-14 mr-4 ml-4">
        <div className="">
          <Card className="border border-border">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording 2</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording 3</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="">
          <Card className="border border-border">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording 2</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>One-click Recording 3</CardTitle>
              <CardDescription>
                Start recording your screen, camera, or both with a single
                click. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}