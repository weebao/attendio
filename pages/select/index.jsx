import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Spinner,
  VStack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, EditIcon, WarningIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { getHeaders, addNewColumn } from "../../fetch/sheet";
import { datepickerStyles } from "../../styles/datepicker";

const SectionPage = dynamic(() => import("../../components/SectionPage"), {
  loading: () => (
    <Center>
      <Spinner size="xl" />
    </Center>
  )
});

const SelectPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionDate, setNewSectionDate] = useState(new Date());
  const [sheetId, setSheetId] = useState("");
  const [headers, setHeaders] = useState(null);
  const [attendanceFirstCol, setAttendanceFirstCol] = useState(-1);
  const [infoCols, setInfoCols] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setSheetId(localStorage.getItem("sheetUrl").split("/")[5]);
    setAttendanceFirstCol(parseInt(localStorage.getItem("attendanceFirstCol") ?? "-1"));
  }, []);

  const discussionQuery = useQuery({
    queryFn: () => getHeaders(sheetId),
    onSuccess: (data) => {
      if (!Array.isArray(data)) return;
      setHeaders(data);
    },
    onError: (error) => {
      console.log(`Discussions query: ${error}`);
    },
    refetchOnWindowFocus: false,
    enabled: sheetId !== ""
  });

  const addMutation = useMutation({
    mutationFn: () => addNewColumn(sheetId, newSectionName),
    onSuccess: (data) => {
      setNewSectionName("");
      discussionQuery.refetch();
    },
    onError: (error) => {
      console.log(`Add discussion query: ${error}`);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const getColor = (i) => {
    if (infoCols.includes(i)) return "teal.500";
    if (attendanceFirstCol === i) return "orange.500";
    return "whiteAlpha.200";
  };

  const getHoveredColor = (i) => {
    if (infoCols.includes(i)) return "teal.400";
    if (attendanceFirstCol === i) return "orange.400";
    return "whiteAlpha.300";
  };

  const handleToggle = (i) => {
    if (attendanceFirstCol === i) {
      setAttendanceFirstCol(-1);
    } else if (infoCols.includes(i)) {
      setInfoCols((prev) => prev.filter((col) => col !== i));
      setAttendanceFirstCol(i);
    } else {
      if (infoCols.length < 2) {
        setInfoCols((prev) => {
          const res = [...prev, i];
          return res.slice(-2);
        });
      } else {
        setAttendanceFirstCol(i);
      }
    }
  };

  const confirmButtonRef = useRef(null);

  const handleAddNewCol = () => {
    // addMutation.mutate();
    setDate(new Date());
    onClose();
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      confirmButtonRef.current.click();
    }
  };

  const handleSaveToLocal = () => {
    console.log(attendanceFirstCol, headers.length);
    if (infoCols.length === 0) {
      setError("There should be at least one non-attendance column");
      return;
    }
    if (attendanceFirstCol < 0 || attendanceFirstCol >= headers.length) {
      setError("Starting column to display attendance is empty");
      return;
    }
    setError("");
    localStorage.setItem("attendanceFirstCol", attendanceFirstCol);
    localStorage.setItem("infoCols", JSON.stringify(infoCols));
    router.push("/select");
  };

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
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="500" mb={4} as="h2" textAlign="center">Choose the section to take attendance</Text>
        {
          discussionQuery.isLoading ? (
            <Flex gap="4">
              <Skeleton w="100px" h="40px" borderRadius="0.375rem"/>
              <Skeleton w="100px" h="40px" borderRadius="0.375rem"/>
              <Skeleton w="100px" h="40px" borderRadius="0.375rem"/>
            </Flex>
          ) : (
            discussionQuery.isError ? (
              <Alert status='error' minHeight="2.5rem" borderRadius={8}>
                <AlertIcon />
                <AlertTitle fontWeight={500}>There was an error loading data from Google Sheets</AlertTitle>
              </Alert>
            ) : (
              <Flex
                wrap="wrap"
                gap={4}
              >
                {
                  headers?.map((header, i) => (
                    <Button
                      id={i}
                      px={6}
                      onClick={() => router.push(`/table?colIndex=${i}`)}
                    >
                      {header}
                    </Button>
                  )).slice(attendanceFirstCol)
                }
                <Button 
                  rightIcon={addMutation.isLoading ? <Spinner size="sm" /> : <AddIcon />}
                  variant="outline"
                  onClick={onOpen}
                >
                  Add section
                </Button>
              </Flex>
            )
          )
        }
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add new section</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb={2}>
                <Text mb={1}>Section name</Text>
                <Input
                  value={`Section ${headers?.length - attendanceFirstCol + 1 ?? 1}`}
                  onChange={(e) => setNewSectionName(e.target.value)} 
                  onKeyPress={handleEnterKeyPress} 
                  placeholder="Section name"
                />
              </Box>
              <Box>
                <Text mb={1}>Date</Text>
                <SingleDatepicker
                  date={newSectionDate}
                  onDateChange={setNewSectionDate}
                  propsConfigs={datepickerStyles}
                  configs={{
                    dateFormat: 'MMM dd, yyyy',
                  }}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={4}>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button ref={confirmButtonRef} colorScheme="blue" onClick={handleAddNewCol}>
                  Confirm
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Alert status="error" mt={4} display={error ? "flex" : "none"} borderRadius={8}>
          <AlertIcon />
          <AlertTitle fontWeight="500">{error}</AlertTitle>
        </Alert>
        <Button onClick={handleSaveToLocal} isDisabled={!headers} mt={8} minHeight="2.5rem">
          Continue
        </Button>
      </Box>
    </>
  );
}

export default SelectPage;