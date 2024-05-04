import { env } from "@/env";
import { Button } from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = await getToken({
      req: ctx.req,
      secret: env.NEXTAUTH_SECRET,
  })
  if (token?.role) {
      return {
          redirect: {
              permanent: false,
              destination: `/`,
          },
          props: {},
      };
  }
  return {
      props: {},
  };
};

function SignIn() {

  const { query } = useRouter();

  return (
    <div className="login-bg fixed bottom-0 left-0 right-0 top-0 z-10 flex flex-col items-center justify-center ">
      <div className="fixed bottom-0 left-0 right-0 top-0 bg-white opacity-75"></div>
      {/* <div className="absolute top-[-7rem] left-[-6rem]  animate-pulse rounded-full bg-[#56C596] opacity-75 mix-blend-multiply blur-xl filter w-[20rem] h-[20rem]"></div>
      <div className="absolute bottom-[-8rem] right-[-5rem]  animate-pulse rounded-full bg-[#d9e6c5] opacity-75 mix-blend-multiply blur-xl filter w-[20rem] h-[20rem]"></div> */}
      <div className="z-50 tracking-wide  shadow-black absolute flex text-center flex-col items-center justify-center top-[13rem] text-2xl font-black">
        <span className="text-primary-50 " >
          Let Us Handle <span className="text-success-50">the</span> Kibble.
        </span>
        <span className="text-success-50">
          You Enjoy <span className="text-primary-50">More Playtime!</span>
        </span>
      </div>
      <Button
        colorScheme="success"
        rounded={"xl"}
        className="noto-sans"
        size={"lg"}
        padding={"2rem 2rem"}
        onClick={() =>
          signIn("line", { callbackUrl: query.callbackUrl as string })
        }
      >
        ทดลองใช้ด้วยบัญชี Line
      </Button>
      <div className=""></div>
    </div>
  );
}

export default SignIn;
