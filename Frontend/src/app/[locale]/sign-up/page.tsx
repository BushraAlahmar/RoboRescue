"use client";
import SignUpForm from "@/components/signup-form";
import React from "react";

function Page() {
  const handleSignUp = (success: boolean, message?: string) => {
    if (success) {
      console.log("Sign up successful:", message);
      // You can redirect to a success page or dashboard here
      // For example: window.location.href = '/dashboard';
    } else {
      console.error("Sign up failed:", message);
      // Handle error - maybe show a toast or alert
    }
  };

  return (
    <div className="h-full py-32 min-h-[100dvh] w-full flex items-center mx-auto justify-center relative">
      <div className="relative z-20 w-full md:max-w-[600px] animate-fadeIn container max-md:px-4">
        <SignUpForm onSubmit={handleSignUp} />
      </div>
    </div>
  );
}

export default Page;
