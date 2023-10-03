import { useState, useEffect } from "react"
import { 
  useReactTable, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
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
  Text,
  useBreakpointValue,
  chakra
} from "@chakra-ui/react"
import { Search2Icon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { ToggleButton } from './ToggleButton'

export const DiscussionTable = ({ headers, data, mutationFn }) => {
  const [sorting, setSorting] = useState([])
  const [searchInput, setSearchInput] = useState("")

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
  })

  const handleSearch = (e) => setSearchInput(e.target.value)

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      tableInstance.setGlobalFilter(searchInput)
    }, 100)
    return () => clearTimeout(timer)
  }, [searchInput])


  const threeColumns = useBreakpointValue({ base: false, md: true })

  return (
    <Box>
      <InputGroup 
        w={{ base: "100%", md: 600 }} 
        mb={6}
      >
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.300" />}
        />
        <Input type="text" placeholder="Search student" onChange={handleSearch} />
      </InputGroup>
      <TableContainer maxW="auto">
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
                    >
                      {flexRender(header.column.columnDef.Header, header.getContext())}
                      <chakra.span pl={3}>
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
  )
}