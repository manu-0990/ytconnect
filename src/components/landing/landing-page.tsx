"use client";

import { ArrowRight, Shield, Upload, Users2, Zap } from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import router from "next/router";
import Link from "next/link";

export default function LandingPage() {

  return (
    <div className="min-h-screen px-24">

      {/* hero section*/}
      <div className="p-14 min-h-[50vh] flex flex-col items-center justify-center gap-10 overflow-hidden">
        <div className="text-center flex flex-col items-center gap-5">
          <h1 className="font-bold text-4xl sm:text-6xl font-sans tracking-tight mx-auto antialiased">
            Effortless Video Collaboration for Creators
          </h1>
          <p className="text-lg tracking-tight font-sans leading-8 mx-auto max-w-2xl">
            Manage, review, and publish content with ease. Collaborate
            seamlessly with your editors in a powerful platform designed for
            modern content creators.
          </p>
        </div>

        <div className="flex gap-24">
          <Button
            variant="large"
            className="bg-slate-200 hover:bg-white text-black font-extralight font-serif inline-flex items-center"
            onClick={() => {router.push("/api/auth/signin")}}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Link href="#features"><Button variant="large">Learn More</Button></Link>
        </div>
      </div>

      {/* features */}
      <div id='features' className="min-h-[50vh] p-14 flex flex-col transition ease-in">
        <h1 className="text-3xl font-bold text-center mb-16">
          Powerful Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: "Role-Based Access",
              description:
                "Assign editors with different permissions for secure collaboration.",
            },
            {
              icon: Zap,
              title: "Review & Approval",
              description:
                "Streamlined process for content review and approval.",
            },
            {
              icon: Upload,
              title: "File Management",
              description:
                "Effortlessly handle videos, thumbnails, and metadata.",
            },
            {
              icon: Users2,
              title: "Real-time Collaboration",
              description: "Live updates and seamless team interactions.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="p-6 border-zinc-500 hover:bg-zinc-900 transition ease-in-out"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="p-16 mx-auto min-h-[50vh]">
        <h1 className="text-3xl font-bold text-center mb-16">How It Works</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Sign Up & Set up",
              description:
                "Login with your google account and select your role.",
            },
            {
              step: "02",
              title: "Invite & Upload",
              description: "Add team members and start uploading your content.",
            },
            {
              step: "03",
              title: "Review & Publish",
              description:
                "Collaborate on content and publish with confidence.",
            },
          ].map((step, index) => (
            <div key={index} className=" text-center ">
              <div className="text-7xl font-bold mb-4 opacity-20">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* If needed footer can be added here in future. */}
    </div>
  );
}
