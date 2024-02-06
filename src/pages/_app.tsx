import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

// import '@/styles/globals.css'

import React, { useState } from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { MantineProvider, createTheme } from "@mantine/core";
import { store } from "@/store";
import { ModalsProvider } from "@mantine/modals";
import { myCustomTheme } from "@/config/myCustomTheme";
import { SessionProvider } from "next-auth/react";
import { Notifications } from "@mantine/notifications";
import { useColorScheme } from "@mantine/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
      <MantineProvider theme={myCustomTheme} defaultColorScheme={colorScheme}>
        <Notifications />
        <Provider store={store}>
          <ModalsProvider>
            <Component {...pageProps} />
          </ModalsProvider>
        </Provider>
      </MantineProvider>
    </SessionProvider>
  );
}
