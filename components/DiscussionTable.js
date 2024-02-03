import { useState, useEffect } from "react";
import { 
  useReactTable, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
  useBreakpointValue,
  chakra
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Search2Icon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { ToggleButton } from "./ToggleButton";
import { ucaList } from "../public/ucaList";

export const DiscussionTable = ({ headers, data, mutationFn }) => {
  const [sorting, setSorting] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const tableInstance = useReactTable({
    data,
    columns: headers,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  const handleSearch = (e) => setSearchInput(e.target.value);

  const modifiedUCAList = [
    { value: null, label: "All UCAs" },
    ...ucaList
  ];
  const filterUCA = (ucaData) => {
    tableInstance.getColumn("attendance").setFilterValue(ucaData.value !== null ? `P-${ucaData.value}` : "");
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      tableInstance.setGlobalFilter(searchInput);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchInput]);


  const threeColumns = useBreakpointValue({ base: false, md: true });

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="stretch" 
      w="100%"
      minW={{ md: 500 }}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        mb={2} 
        justifyContent="stretch"
      >
        <InputGroup 
          w="100%"
          flex="1"
        >
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.300" />}
          />
          <Input type="text" placeholder="Search student" onChange={handleSearch} />
        </InputGroup>
      </Stack>
      <Text mb={6} color="#68717d" textAlign="left">*You can click/tap to sort the columns</Text>
      <TableContainer maxW="100%">
        <Table size={{ base: 'sm', md: 'md' }}>
          <Thead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <Tr>
                {headerGroup.headers.map((header, i) => (
                  (threeColumns || i !== 1) && 
                    <Th
                      cursor={"pointer"}
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      // pl={{ base: !header.column.getIsSorted() && 3, md: 0 }}
                    >
                      {i === 2 ? "Attendance" : flexRender(header.column.columnDef.Header, header.getContext())}
                      <chakra.span pl={{ base: header.column.getIsSorted() ? 3 : 6, md: 3}}>
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {
              tableInstance.getRowModel().rows.map((row) => (
                <Tr>
                  {
                    row.getVisibleCells().map((cell, i) => (
                      (threeColumns || i !== 1) &&
                        <Td>
                          {
                            i !== 2 ? cell.renderValue() :
                              <ToggleButton
                                key={cell.id}
                                isPresent={cell.getValue()?.charAt(0) === 'P'}
                                student={cell.id}
                                mutateFn={mutationFn}
                              />
                          }
                        </Td>
                    ))
                  }
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}