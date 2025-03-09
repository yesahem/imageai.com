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

export default function ModelTrainingModal() {
  const router = useRouter();
  const [zipUrl,setZipUrl] = useState<string>("")
  const [disable,setDisabled] = useState(true)
  const { handleSubmit, register, control,setValue } = useForm<ModelTraningInput>();

  // function trainModel<ModelTraningInput>(data: ModelTraningInput) {
  //   console.log("hii there");
  //   console.log("model data", data);
  // }

  const onSubmit: SubmitHandler<ModelTraningInput> = (data) => {
    // make the axios post request to the backend and get the model train
    console.log("form data", data);

    
  };
  
  
  const trainModel =async ()=>{
    //uncomment this to train model (remember training a model will cost you 2$ )
    // const modelTrain = await axios.post(`${BACKEND_URL}/ai/trainModel`)
    
    // console.log(modelTrain.data)
    
    alert("model is being trained, till then chill-out buddy\n now its our job ")
    
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <Card className="w-[450px] ">
        <CardHeader>
          <CardTitle className="items-center flex justify-center bg-gradient-to-l from-red-400 to-pink-500 bg-clip-text text-transparent">
            <strong>Train the model</strong>
          </CardTitle>
          <CardDescription>
            Train your own image generation model in just
            <strong className="bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent">
              {" "}
              Few Clicks
            </strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
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
                <Input
                  id="name"
                  placeholder="Age of the model"
                  {...register("age")}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
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
                        <SelectItem value="Female" className="cursor-pointer">
                          Female
                        </SelectItem>
                        <SelectItem value="Others" className="cursor-pointer">
                          Others
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
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
                      <SelectTrigger id="ethnicity"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="White" className="cursor-pointer">
                          White
                        </SelectItem>
                        <SelectItem value="Black" className="cursor-pointer">
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
                        <SelectItem value="Hispanic" className="cursor-pointer">
                          Hispanic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
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
                      <SelectTrigger id="eyeColor" >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Brown" className="cursor-pointer">
                          Brown
                        </SelectItem>
                        <SelectItem value="Blue" className="cursor-pointer">
                          Blue
                        </SelectItem>
                        <SelectItem value="Hazel" className="cursor-pointer">
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

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bald">Bald</Label>
                <Controller
                  name="bald"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Select onValueChange={(val) => field.onChange(val === "Yes")} >
                      <SelectTrigger id="bald" >
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

            <FileUpload onUploadComplete={(zipUrl)=>{
              setZipUrl(zipUrl)
              setValue("zipUrls",zipUrl)
            }} />

            <CardFooter className="flex justify-between mt-2">
              <Button variant="outline" className="cursor-pointer" onClick={()=>{
                router.push("/")
              }}>
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                className="cursor-pointer"
                // disabled     ==> if any of the property  like name,age,ethnicity and all is empty then simply disable this button (functionality to be added)
                onClick={trainModel}
              >
                Start Training{" "}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
