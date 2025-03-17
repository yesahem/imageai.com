"use client";

import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { Review } from "./components/Reviews";


export default function Home() {

  return (
    <>
      
      <Hero />
      <Features />
      <Review />
      <Pricing />
      <Footer />
    </>
  );
}
