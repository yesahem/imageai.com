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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FileUpload } from "@/components/FileUpload";
import { ModelTraningInput } from "common/infered";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const router = useRouter();
  const [fileUploaded, setFileUploaded] = useState(true);
  const [zipUrl, setZipUrl] = useState<string>("");
  const { getToken } = useAuth();
  const { handleSubmit, register, control, setValue , watch} =
    useForm<ModelTraningInput>();

  const onSubmit = async () => {
    const formData = {
        name: watch("name"),
        type: watch("type"),
        age: watch("age"),
        ethnicity: watch("ethnicity"),
        eyeColor: watch("eyeColor"),
        bald: watch("bald"),
        zipUrls: watch("zipUrls"),
      };
    // make the axios post request to the backend and get the model train
    console.log("form data",formData);
    if (zipUrl === "" || !zipUrl) {
      alert("zip url is empty");
      return;
    }
    // watch.zipUrls = zipUrl;
    
    // setData(data);

    const Token = await getToken();
    //uncomment this to train model (remember training a model will cost you 2$, fuck this cause in backend its already commented )
    const modelTrain = await axios.post(
      `${BACKEND_URL}/ai/trainModel`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );

    console.log("traning data", modelTrain.data);

    alert(
      "model is being trained, till then chill-out buddy\n now its our job "
    );

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Tabs defaultValue="details" className="w-[450px] mt-40">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="upload-Image">Upload Images</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card className="w-[450px] ">
            <CardHeader>
              {/* <CardTitle className="items-center flex justify-center text-white text-2xl"> */}
              <CardTitle className="text-3xl font-bold">
                Train the model
              </CardTitle>
              <CardDescription>
                Train your own image generation model in just
                {/* <strong className="bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent"> */}
                <strong className=""> Few Clicks</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form >
                <div className="grid w-full items-center gap-4">
                  <div className="flex justify-between gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of your model"
                      {...register("name")}
                    />
                    
                    
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Age">Age</Label>
                    <Controller
                      name="age"
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <Input
                          id="age"
                          placeholder="Age of the model"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                  </div>

                  <div className="flex justify-between gap-3">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="type">Type</Label>
                    <Controller
                      name="type"
                      defaultValue="Male"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="Male" className="cursor-pointer">
                              Male
                            </SelectItem>
                            <SelectItem
                              value="Female"
                              className="cursor-pointer"
                            >
                              Female
                            </SelectItem>
                            <SelectItem
                              value="Others"
                              className="cursor-pointer"
                            >
                              Others
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Controller
                      name="ethnicity"
                      defaultValue="White"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="ethnicity">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem
                              value="White"
                              className="cursor-pointer"
                            >
                              White
                            </SelectItem>
                            <SelectItem
                              value="Black"
                              className="cursor-pointer"
                            >
                              Black
                            </SelectItem>
                            <SelectItem
                              value="AsianAmerican"
                              className="cursor-pointer"
                            >
                              AsianAmerican
                            </SelectItem>
                            <SelectItem
                              value="EastAsian"
                              className="cursor-pointer"
                            >
                              EastAsian
                            </SelectItem>
                            <SelectItem
                              value="SouthEastAsian"
                              className="cursor-pointer"
                            >
                              SouthEastAsian
                            </SelectItem>
                            <SelectItem
                              value="SouthAsian"
                              className="cursor-pointer"
                            >
                              SouthAsian
                            </SelectItem>
                            <SelectItem
                              value="MiddleEastern"
                              className="cursor-pointer"
                            >
                              MiddleEastern
                            </SelectItem>
                            <SelectItem
                              value="Hispanic"
                              className="cursor-pointer"
                            >
                              Hispanic
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  </div>

                  <div className="flex justify-between gap-3">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="eyeColor">EyeColor</Label>
                    <Controller
                      name="eyeColor"
                      control={control}
                      defaultValue="Hazel"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="eyeColor">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem
                              value="Brown"
                              className="cursor-pointer"
                            >
                              Brown
                            </SelectItem>
                            <SelectItem value="Blue" className="cursor-pointer">
                              Blue
                            </SelectItem>
                            <SelectItem
                              value="Hazel"
                              className="cursor-pointer"
                            >
                              Hazel
                            </SelectItem>
                            <SelectItem value="Gray" className="cursor-pointer">
                              Gray
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="bald">Bald</Label>
                    <Controller
                      name="bald"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => field.onChange(val === "Yes")}
                        >
                          <SelectTrigger id="bald">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="Yes" className="cursor-pointer">
                              Yes
                            </SelectItem>
                            <SelectItem value="No" className="cursor-pointer">
                              No
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                    
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload-Image">
          <Card>
            <CardHeader>
               <CardTitle>
                Upload Images
               </CardTitle>
               <CardDescription>
               Upload at least 6 images for  better training
               </CardDescription>
            </CardHeader>
          <CardContent>
          <FileUpload
            onUploadComplete={(zipUrl) => {
              setZipUrl(zipUrl);
              setValue("zipUrls", zipUrl);
            }}
            setFileUploaded={setFileUploaded}
          />
        
      
          
          </CardContent>
          <CardFooter className="flex justify-between mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              className="cursor-pointer"
              onClick={onSubmit}
              disabled={!fileUploaded}
            >
              Start Training{" "}
            </Button>
          </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
