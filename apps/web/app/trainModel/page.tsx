"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FileUpload } from "@/components/FileUpload";

export default function ModelTrainingModal() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <Card className="w-[450px] ">
        <CardHeader>
          <CardTitle>Train the model</CardTitle>
          <CardDescription>
            Train your own image generation model in just
            <strong>Few Clicks</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your model" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Age">Age</Label>
                <Input id="name" placeholder="Age of the model" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select >
                  <SelectTrigger id="type" >
                    <SelectValue placeholder="Select"/> 
                  </SelectTrigger>
                  <SelectContent position="popper" >
                    <SelectItem value="Male" className="cursor-pointer">Male</SelectItem>
                    <SelectItem value="Femlae" className="cursor-pointer">Female</SelectItem>
                    <SelectItem value="Others" className="cursor-pointer">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Select>
                  <SelectTrigger id="ethnicity">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="White" className="cursor-pointer">White</SelectItem>
                    <SelectItem value="Black" className="cursor-pointer">Black</SelectItem>
                    <SelectItem value="AsianAmerican" className="cursor-pointer">AsianAmerican</SelectItem>
                    <SelectItem value="EastAsian" className="cursor-pointer">EastAsian</SelectItem>
                    <SelectItem value="SouthEastAsian" className="cursor-pointer">
                      SouthEastAsian
                    </SelectItem>
                    <SelectItem value="SouthAsian" className="cursor-pointer">SouthAsian</SelectItem>
                    <SelectItem value="MiddleEastern" className="cursor-pointer">MiddleEastern</SelectItem>
                    <SelectItem value="Hispanic" className="cursor-pointer">Hispanic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="eyeColor">EyeColor</Label>
                <Select>
                  <SelectTrigger id="eyeColor">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Brown" className="cursor-pointer">Brown</SelectItem>
                    <SelectItem value="Blue" className="cursor-pointer">Blue</SelectItem>
                    <SelectItem value="Hazle" className="cursor-pointer">Hazle</SelectItem>
                    <SelectItem value="Gray" className="cursor-pointer">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bald">Bald</Label>
                <Select>
                  <SelectTrigger id="Bald">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Yes" className="cursor-pointer">
                      Yes (Model doesn&apos;t have hairs)
                    </SelectItem>
                    <SelectItem value="No" className="cursor-pointer">No (Model have Hairs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>

        <FileUpload />

        <CardFooter className="flex justify-between mt-2">
          <Button variant="outline" className="cursor-pointer">Cancel</Button>
          <Button variant="default" onClick={()=>{
            alert("model")
          }} className="cursor-pointer">Start Training </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
