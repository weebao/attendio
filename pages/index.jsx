import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  chakra,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box, 
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperMessage,
  Input,
  ListItem,
  OrderedList,
  Text,
  useClipboard
} from "@chakra-ui/react"
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { ucaList } from '../public/ucaList'


const HomePage = ({ uca }) => {
  const router = useRouter()
  const [isSheetInvalid, setIsSheetInvalid] = useState(false)
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [name, setName] = useState("")
  const [sheetUrl, setSheetUrl] = useState("")
  const { onCopy, value, setValue, hasCopied } = useClipboard("sheets@attend-io-123.iam.gserviceaccount.com")

  useEffect(() => {
    const name = localStorage.getItem('name')
    const sheetUrl = localStorage.getItem('sheetUrl')
    setName(name ?? "")
    setSheetUrl(sheetUrl ?? "")
  }, [])
  
  const onSubmit = () => {
    if (name === "" && sheetUrl === "") {
      setIsNameInvalid(true)
      setIsSheetInvalid(true)
      setErrorMessage("Please input your name and Google Sheet URL")
    } else if (name === "") {
      setIsNameInvalid(true)
      setErrorMessage("Please input your name")
    } else if (sheetUrl === "") {
      setIsSheetInvalid(true)
      setErrorMessage("Please input your Google Sheet URL")
    } else if (sheetUrl.match(/https:\/\/docs.google.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/g) === null) {
      setIsSheetInvalid(true)
      setErrorMessage("Google Sheet URL is not valid")
    } else {
      localStorage.setItem('sheetUrl', sheetUrl)
      localStorage.setItem('name', name)
      router.push('/setting')
    }
  }

  return (
    <>
      <Head>
        <title>Attendio</title>
        <meta name="description" content="Taking attendance with Google Sheets made easier" />
      </Head>
      <Box
        display="flex"
        flexDirection="column"
        // justifyContent="center"
        // alignItems="center"
        h="90dvh"
        px={8}
        maxWidth="600px"
        margin="auto"
      >
        <Text fontSize={{base: "3xl", md: "5xl"}} fontWeight="bold" textAlign="center" color="green.300" mt={12} as="h1">
          Attendio
        </Text>
        <Text fontWeight={500} mb={8} textAlign="center">
          Taking attendance with <chakra.span color="green.300">Google Sheets</chakra.span> made easier
        </Text>
        <Text mb={2} textAlign="left" fontStyle="italic" color="whiteAlpha.500">
          *If you are new, please check the instructions below
        </Text>
        <FormControl isInvalid={isSheetInvalid || isNameInvalid} mb={4}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
          >
            <Box
              display="flex"
              alignItems="stretch"
              justifyContent="stretch"
              flexDirection={{ base: 'column', md: 'row' }}
              gap={{ base: 2, md: 2 }}
              w="100%"
            >
              <FormControl isInvalid={isSheetInvalid} flex={2}>
                <Input 
                  placeholder="Input Google Sheets URL"
                  isRequired
                  onChange={(e) => setSheetUrl(e.target.value)}
                  defaultValue={sheetUrl ?? ""}
                  minHeight="40px"
                />
              </FormControl>
              <FormControl isInvalid={isNameInvalid} flex={1}>
                <Input
                  placeholder="Input name"
                  isRequired
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={name ?? ""}
                  minHeight="40px"
                />
              </FormControl>
            </Box>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
            <Button type="submit" onClick={onSubmit} mt={2}>Start</Button>
          </Box>
        </FormControl>
        <Accordion allowToggle w="100%">
          <AccordionItem border="none">
            <h2>
              <AccordionButton px="0">
                <AccordionIcon mr={1}/>
                <Box flex="1" textAlign="left" fontWeight="500">
                  <Text fontSize="lg">How to start?</Text>
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pl={2} pb={4}>
              <OrderedList spacing={5}>
                <ListItem>
                  <Text mb={3}>
                      Copy the service account's email below. In your Google Sheet, click the&nbsp;
                    <chakra.b
                      fontWeight={500}
                      color="cyan.500"
                    >
                      Share
                    </chakra.b> 
                    &nbsp;button on the top right corner and add the service account's email as&nbsp;
                    <chakra.b
                      fontWeight={500}
                      color="cyan.500"
                    >
                      Editor
                    </chakra.b>
                  </Text>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor="whiteAlpha.100" 
                    px={1}
                    borderRadius={4}
                    cursor="pointer"
                    onClick={onCopy}
                  >
                    <span>
                      <pre>sheets@attend-io-123.iam.gserviceaccount.com</pre>
                    </span>
                    {hasCopied ? <CheckIcon /> : <CopyIcon />}
                  </Box>
                </ListItem>
                <ListItem>
                  <Text mb={3}>As below, input your Google Sheet URL and your name above</Text>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor="whiteAlpha.100" 
                    px={1}
                    borderRadius={4}
                    cursor="pointer"
                    mb={2}
                  >
                    <chakra.pre wordBreak="break-all">
                      https://docs.google.com/spreadsheets/d/190w6mQnC_EZ07uJEExbyqRCxLbrgrvYtGXlgOTOD5A3/edit#gid=0
                    </chakra.pre>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor="whiteAlpha.100" 
                    px={1}
                    borderRadius={4}
                    cursor="pointer"
                  >
                    <chakra.pre wordBreak="break-all">
                      John Doe
                    </chakra.pre>
                  </Box>
                </ListItem>
              </OrderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Accordion allowToggle w="100%">
          <AccordionItem border="none">
            <h2>
              <AccordionButton px="0">
                <AccordionIcon mr={1}/>
                <Box flex="1" textAlign="left" fontWeight="500">
                  <Text fontSize="lg">Will my data be leaked?</Text>
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pl={2} pb={4}>
              <Text pl={4}>No. I designed this to be a serverless app with no database so your data will not be leaked and stored anywhere.</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
}

export default HomePage