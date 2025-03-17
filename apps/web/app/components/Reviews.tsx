import { Star } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Review() {
  return (
    <div className=" mt-40 flex flex-col items-center justify-center ">
      <h1 className="text-3xl font-bold tracking-tight ">
        Loved by teams worldwide.
      </h1>

      <h2 className="text-muted-foreground pt-5 text-xl">
        See what peoples have to say about how images-ai has transformed their
        socials.
      </h2>

      <div className="flex gap-10 mt-14 mr-4 ml-4">
        <div className="">
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className=" flex">
                <Star className="h-4 w-4 fill-white " />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
              </div>
              <CardTitle>Chrollo</CardTitle>
              <CardDescription className="italic">
                kya mast app banaya hai bawa, Swad aagaya
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className=" flex">
                <Star className="h-4 w-4 fill-white " />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
              </div>
              <CardTitle>Chrollo</CardTitle>
              <CardDescription className="italic">
                kya mast app banaya hai bawa, Swad aagaya
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="">
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className=" flex">
                <Star className="h-4 w-4 fill-white " />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
              </div>
              <CardTitle>Chrollo</CardTitle>
              <CardDescription className="italic">
                kya mast app banaya hai bawa, Swad aagaya
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border mt-2">
            <CardHeader>
              <div className=" flex">
                <Star className="h-4 w-4 fill-white " />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
                <Star className="h-4 w-4 fill-white" />
              </div>
              <CardTitle>Chrollo</CardTitle>
              <CardDescription className="italic">
                kya mast app banaya hai bawa, Swad aagaya
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
