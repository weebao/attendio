'use client'
import { useState } from "react"
import { QueryClient, QueryClientProvider } from 'react-query'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme, Box, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react'

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
  }
})

export const Layout = ({ children }) => {
  const [isValid, setIsValid] = useState(false)
  const onPasswordChange = (pwd) => pwd === "1250" && setIsValid(true)
  
  return (
    <QueryClientProvider client={new QueryClient()}>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Box py={4} px={8}>
            <Analytics />
            {isValid ? children :
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center" 
                alignItems="center"
                h="90dvh"
              >
                <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={4} as="h1">
                  CS250 Roster
                </Text>
                <Text fontSize="lg" textAlign="center" mb={3} as="h2">
                  Please enter password
                </Text>
                <HStack>
                  <PinInput autoFocus onChange={onPasswordChange} >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </Box>
            }
          </Box>
        </ChakraProvider>
      </CacheProvider>
    </QueryClientProvider>
  )
}