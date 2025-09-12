"use client";
import LoginForm from "@/components/signin-form";
import React from "react";

function Page() {
  const handleLogin = (success: boolean, message?: string) => {
    if (success) {
      console.log("Sign in successful:", message);
      // You can redirect to dashboard or home page here
      // For example: window.location.href = '/dashboard';
    } else {
      console.error("Sign in failed:", message);
      // Handle error - maybe show a toast or alert
    }
  };

  return (
    <div className="  h-full py-32 min-h-[100dvh] w-full flex items-center mx-auto  justify-center relative">
      <div className="relative z-20 w-full md:max-w-[600px]  animate-fadeIn container max-md:px-4">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}

export default Page;
