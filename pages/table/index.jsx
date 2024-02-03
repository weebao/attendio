import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "react-query";
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
  Skeleton,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, EditIcon, WarningIcon } from "@chakra-ui/icons";
import { getSectionData, setPresent, setAbsent } from "../../fetch/sheet";
import { ToggleButton } from "../../components/ToggleButton";
import { DiscussionTable } from "../../components/DiscussionTable";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";

const TablePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const colIndex = parseInt(searchParams.get("colIndex") ?? "0");

  const [studentData, setStudentData] = useState(null);
  const [name, setName] = useState("");
  const [newColName, setNewColName] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [headers, setHeaders] = useState(null);
  const [attendanceFirstCol, setAttendanceFirstCol] = useState(-1);
  const [infoCols, setInfoCols] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setSheetId(localStorage.getItem("sheetUrl").split("/")[5]);
    setAttendanceFirstCol(parseInt(localStorage.getItem("attendanceFirstCol") ?? "-1"));
    setInfoCols(JSON.parse(localStorage.getItem("infoCols") ?? "[]"));
  }, []);

  const discussionQuery = useQuery({
    queryFn: () => getSectionData(sheetId, colIndex, infoCols),
    onSuccess: (data) => {
      setHeaders(data.headers.map((header, i) => ({
        Header: header,
        accessorKey: i === 2 ? "attendance" : `col${i+1}`,
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: "equalsString",
      })));
      setStudentData(data.body);
    },
    onError: (err) => {
      console.log(`Col ${colIndex} query: ${err}`);
    },
    enabled: sheetId !== "",
    refetchOnWindowFocus: false,
  });

  const attendanceMutation = useMutation({
    mutationFn: (data) => {
      let uca = localStorage.getItem("uca");
      if (data[0]) {
        return setPresent(data[1], id, uca);
      } else {
        return setAbsent(data[1], id, uca);
      }
    },
    onSuccess: (data) => {
      discussionQuery.refetch();
    },
    onError: (error) => {
      console.log(`Attendance Mutation: ${err}`);
    },
  });

  const headerConfig = useMemo(() => [
    {
      Header: "Name",
      accessorKey: "name",
      enableGlobalFilter: true,
    },
    {
      Header: "Preferred Name",
      accessorKey: "preferredName",
      enableGlobalFilter: true,
    },
    {
      Header: "Attendance",
      accessorKey: "attendance",
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
  ], []);

  const threeColumns = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Head>
        <title>Select</title>
      </Head>
      <Box 
        display="flex"
        flexDirection="column"
        h="90dvh"
        px={8}
        maxWidth="600px"
        margin="auto"
      >
        <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" textAlign="center" mt={6} mb={0} color="green.300" as="h1">Attendio</Text>
        <HStack mb={6} mr="-16px" justifyContent="center">
          <Text fontSize="lg" as="span">Name: </Text>
          <Text fontSize="lg" fontWeight="bold" as="span" color="green.300">{name}</Text>
          <IconButton 
            aria-label='Edit name' 
            icon={<EditIcon />} 
            h={8} 
            w={8} 
            minWidth={8} 
            bg="transparent"
            onClick={() => router.push("/")}
          />
        </HStack>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          textAlign="center"
        >
          <HStack mb={6} w="full" alignItems="center" justifyContent="space-between">
            <IconButton 
              aria-label='Back to select'
              icon={<ArrowBackIcon />}
              h={8}
              w={8}
              minWidth={8}
              pt={0.5}
              bg="transparent"
              onClick={() => router.push("/select")}
            />
            {
              discussionQuery.isLoading || studentData === null ? <Skeleton w="100px" h="40px" borderRadius="0.375rem"/> : (
                <Text fontSize={{ base: "2xl" }} fontWeight="bold" as="h2">{headers[2].Header}</Text>
              )
            }
            <Box w={8}/>
          </HStack>
          {
            discussionQuery.isLoading || studentData === null ? (
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
      </Box>
    </>
  );
}

export default TablePage;