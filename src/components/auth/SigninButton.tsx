"use client";

import { signIn } from "next-auth/react";
import { IconBrandGoogleFilled } from '@tabler/icons-react';

export default function SigninButton() {

  return (
    <button
      className="cursor-pointer hover:bg-slate-200 transition-all duration-200 bg-white text-black flex gap-5 items-center px-5 rounded-md"
      onClick={() => signIn("google")}
    >
      <IconBrandGoogleFilled/>
      Sign in with Google
    </button>
  );
}
