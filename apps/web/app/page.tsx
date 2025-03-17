"use client";
import { ArrowRight } from "lucide-react";
import { Accordion } from "./components/Accordion";
import { Button } from "./components/ui/button";

export default function Home() {
  
  function NavigatePage(){
    alert("naviagate  to pages based on user login")
  }
  return (
    <div className=" flex mt-40 rounded-lg  ">
      <div className="  w-[100%]  m-1 p-2 md:w-[50%] md: text-center ">
        <h2 className="quicksand-bold font-white  ml-4 w-full  text-4xl md:text-5xl lg:text-6xl font-bold leading-tigh">
          Transform Your Ideas Into Stunning Visuals
        </h2>

        <p className="text-lg text-muted-foreground max-w-xl mt-4 ml-4 leading-tight">
          Get Your Images in No-Time.
        </p>

        <Button className="text-black ml-4 mt-4 hover:cursor-pointer" onClick={NavigatePage}>
          {" "}
          Get Started <ArrowRight />
        </Button>
      </div>

      <div className=" hidden w-[50%] m-1 p-2  md:block ">
        <Accordion />
      </div>
    </div>
  );
}
