import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";

const themeChakra = extendTheme({
  colors: {
    success: {
      50: "#00B900",
      100: "#00B900",
      500: "#00B900",
      600: "#00B900",
    },
    // primary: {
    //     50: "#006C67",
    //     100: "#006C67",
    //     500: "#006C67",
    //     600: "#006C67",
    // },
    // secondary: {
    //     50: "#B2BB1C",
    //     100: "#B2BB1C",
    //     500: "#B2BB1C",
    // },
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider theme={themeChakra}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
