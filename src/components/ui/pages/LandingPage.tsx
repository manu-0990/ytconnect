"use client";

import { Shield, Upload, Users2, Zap } from "lucide-react";
import { Button } from "@/components/ui/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCard from "../ui/CustomCard";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="h-screen px-24 transition-all duration-700 ease-in-out">

      {/* hero section*/}
      <div className="p-14 min-h-screen flex flex-col items-center justify-center gap-10 overflow-hidden">
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
            size="lg"
            variant='default'
            className="rounded-lg py-6"
            onClick={() => signIn("google")}
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </Button>
          <Link href="#features"><Button size='lg' variant='outline' className="py-6">Learn More</Button></Link>
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
            <CustomCard
              key={index}
              className="p-6 border-zinc-500 hover:bg-zinc-900 transition ease-in-out"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CustomCard>
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
