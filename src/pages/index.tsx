import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
    {session ? (
      <>
        {session.user.name}
        {session.user.email}<br />
        {session.user.id} <br />
        {session.user.providerAccountId}<br />
        {session.user.role}<br />
        <img src={session.user.image} alt={session.user.name} />
      </>
      ) : null}
      
    </>
  );
}

