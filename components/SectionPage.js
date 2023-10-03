import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from 'react-query'
import { 
  Alert,
  AlertIcon,
  AlertTitle,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spinner,
  useBreakpointValue
} from '@chakra-ui/react'
import { ucaList } from '../public/ucaList'
import { getDiscussionData, setPresent, setAbsent } from '../fetch/sheet'
import { ToggleButton } from './ToggleButton'
import { DiscussionTable } from './DiscussionTable'
import { ArrowBackIcon, Search2Icon } from '@chakra-ui/icons'

const SectionPage = ({ id, resetFn }) => {
  const discussionDate = new Date("September 13, 2023")
  discussionDate.setDate(discussionDate.getDate() + 7 * (id-1))
  const [studentData, setStudentData] = useState(null)
    
  const discussionQuery = useQuery({
    queryFn: () => getDiscussionData(id),
    onSuccess: (data) => {
      setStudentData(data)
    },
    onError: (error) => {
      console.log(`Discussion ${id} query: ${err}`)
    },
    enabled: id !== undefined,
    refetchOnWindowFocus: false,
  })

  const attendanceMutation = useMutation({
    mutationFn: (data) => {
      let uca = localStorage.getItem('uca')
      if (data[0]) {
        return setPresent(data[1], id, uca)
      } else {
        return setAbsent(data[1], id, uca)
      }
    },
    onSuccess: (data) => {
      discussionQuery.refetch()
    },
    onError: (error) => {
      console.log(`Attendance Mutation: ${err}`)
    }
  })
  
  const headers = useMemo(() => [
    {
      Header: 'Name',
      accessorKey: 'name',
      enableGlobalFilter: true
    },
    {
      Header: 'Preferred Name',
      accessorKey: 'preferredName',
      enableGlobalFilter: true
    },
    {
      Header: 'Attendance',
      accessorKey: 'attendance'
    }
  ], [])
  const threeColumns = useBreakpointValue({ base: false, md: true })

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      textAlign="center"
    >
      <HStack mb={6}>
        <IconButton icon={<ArrowBackIcon boxSize={6} />} mr={3} onClick={() => resetFn()}/>
        <Text fontSize={{ base: "2xl" }} fontWeight="bold" as="h2">Discussion {id} ({discussionDate.toDateString().slice(4,-5)})</Text>
      </HStack>
      {
        discussionQuery.isLoading || id === undefined || studentData === null ? (
          <Spinner size="lg"/>
        ) : (
          discussionQuery.isError ? (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>There was an error loading data from Google Sheets</AlertTitle>
            </Alert>
          ) : (
            <DiscussionTable 
              headers={headers} 
              data={studentData}
              mutationFn={attendanceMutation.mutate}
            />
          )
        )
      }
    </Box>
  )
}

export default SectionPage