import { useState } from "react"
import { useQuery, useMutation } from "react-query"
import { useRouter } from "next/router"
import dynamic from 'next/dynamic'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center, 
  Grid, 
  GridItem,
  HStack,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import { getHeaders, addDiscussion } from "../../fetch/sheet"
import { ucaList } from "../../public/ucaList"

const SectionPage = dynamic(() => import("../../components/SectionPage"), {
  loading: () => (
    <Center>
      <Spinner size="xl" />
    </Center>
  )
})

const DiscussionPage = () => {
  const [headers, setHeaders] = useState(null)
  const [id, setId] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const router = useRouter()
  
  const discussionQuery = useQuery({
    queryFn: getHeaders,
    onSuccess: (data) => {
      setHeaders(data)
    },
    onError: (error) => {
      console.log(`Discussions query: ${error}`)
    },
    refetchOnWindowFocus: false
  })
  
  const addMutation = useMutation({
    mutationFn: addDiscussion,
    onSuccess: (data) => {
      discussionQuery.refetch()
    },
    onError: (error) => {
      console.log(`Add discussion query: ${error}`)
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const reload = () => {
    setTimeout(() => {
      router.push('/discussion');
    }, 1);
    router.push('/')
  }

  return (
    <Box 
      display="flex"
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      textAlign="center"
    >
      <Text fontSize="3xl" fontWeight="bold" mt={6} mb={1} as="h1">CS250 Roster</Text>
      <HStack mb={6}>
        <Text fontSize="lg" as="span">UCA: </Text>
        <Text fontSize="lg" fontWeight="bold" as="span">{ucaList[localStorage.getItem('uca')].label}</Text>
      </HStack>
      {
        id === null ? (
          <>
            <Text fontSize="xl" fontWeight="bold" mb={4} as="h2">Select Discussion</Text>
              {
                discussionQuery.isLoading ? (
                  <Spinner size="lg"/>
                ) : (
                  discussionQuery.isError || headers === null ? (
                    <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>There was an error loading data from Google Sheets</AlertTitle>
                    </Alert>
                  ) : (
                    <Grid 
                      templateColumns={{ 
                        base: "repeat(2, 1fr)",
                        sm: "repeat(4, 1fr)",
                        md: "repeat(6, 1fr)",
                        lg: "repeat(8, 1fr)" 
                      }} 
                      gap={4}
                    >
                      <GridItem colSpan={2}>
                        <Button 
                          rightIcon={addMutation.isLoading ? <Spinner size="sm" /> : <AddIcon />}
                          variant="outline"
                          onClick={() => addMutation.mutate()}
                        >
                            Add Discussion
                        </Button>
                      </GridItem>
                      {
                        headers.slice(4).map((header, i) => (
                          <GridItem colSpan={2}>
                            <Button w="100%" onClick={() => setId(i)}>{header}</Button>
                          </GridItem>
                        )).reverse()
                      }
                    </Grid>
                  )
                )
              }
            </>
        ) : (
          <SectionPage id={id+1} resetFn={reload} />
        )
      }
    </Box>
  )
}

export default DiscussionPage