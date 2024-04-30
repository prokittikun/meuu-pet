import { Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import React from "react";

function SignIn() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-10 flex flex-col items-center justify-center  ">
      <div className="absolute top-[-7rem] left-[-6rem]  animate-pulse rounded-full bg-[#56C596] opacity-75 mix-blend-multiply blur-xl filter w-[20rem] h-[20rem]"></div>
      <div className="absolute bottom-[-8rem] right-[-5rem]  animate-pulse rounded-full bg-[#d9e6c5] opacity-75 mix-blend-multiply blur-xl filter w-[20rem] h-[20rem]"></div>
      <Button
        colorScheme="success"
        rounded={"none"}
        size={"lg"}
        onClick={() =>
          signIn("line", { callbackUrl: "https://asus.kittikun.me" })
        }
      >
        Log in with LINE account
      </Button>
    </div>
  );
}

export default SignIn;
