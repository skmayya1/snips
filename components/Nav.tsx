import React from "react";
import Container from "./Container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { CreditStar } from "./CreditStar";
import { authClient } from "@/lib/auth-client";

export const Nav = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="flex items-center justify-between p-4 w-full px-10 fixed top-0 z-50 ">
      <Container
        // background={true}
        className="flex items-center justify-center gap-2"
        border={true}
      >
        <div className="h-full w-full flex items-center justify-center">
          {session?.user.image ? (
            <Image
              alt="user logo"
              className="h-8 w-8 rounded-sm "
              src={session?.user.image}
              height={100}
              width={100}
            />
          ) : (
            <div className="h-8 w-8 rounded-sm bg-blue-500/70 flex items-center justify-center">
              {session?.user.name.at(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col w-fit items-start justify-center text-silver">
          <div className=" text-xs font-semibold whitespace-nowrap">
            {session?.user.name}
          </div>
          <div className=" text-xs text-silver/50 font-semibold whitespace-nowrap">
            {session?.user.email}
          </div>
        </div>
      </Container>
      <Container background className="flex items-center justify-center gap-2 text-sm py-3 ">
          <CreditStar />
          <p className="whitespace-nowrap text-sm">5</p>
        </Container>
    </nav>
  );
};
