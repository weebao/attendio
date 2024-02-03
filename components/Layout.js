"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      200: "#edf2f7",
      900: "#1a202c",
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

export const Layout = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ChakraProvider theme={theme}>
        <Analytics />
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}