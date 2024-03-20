"use-client";
import React, { useEffect } from "react";
import { Box, Center, Group } from "@mantine/core";
import Head from "next/head";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { useSessionStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const Layout = ({ children, title, description }: Props) => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status !== "authenticated" && session.status !== "loading")
      router.push("/login");
  }, [session, router]);
  return (
    <Group>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box w="100%" mb={100}>
        <Navbar />

        {children}
      </Box>
    </Group>
  );
};

export default Layout;
