import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box, 
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperMessage,
  Input,
  Text
} from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import { ucaList } from '../public/ucaList'


const HomePage = ({ uca }) => {
  const router = useRouter()
  const [isEmpty, setIsEmpty] = useState(false)
  const [selectedUCA, setSelectedUCA] = useState(null)
  const [initialUCA, setInitialUCA] = useState(null)

  useEffect(() => {
    const uca = localStorage.getItem('uca')
    if (uca) {
      setInitialUCA(parseInt(uca))
      setSelectedUCA(parseInt(uca))
    }
    else {
      setInitialUCA(0);
    }
  }, [])
  
  const onSubmit = () => {
    if (selectedUCA === null) {
      setIsEmpty(true)
    } else {
      localStorage.setItem('uca', selectedUCA)
      router.push('/discussion')
    }
  }
  return (
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
      <FormControl isInvalid={isEmpty}>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection={{ base: 'column', md: 'row' }}
          gap={{ base: 2, md: 2 }}
        >
          <Box
            w={{ base: '100%', md: '250px'}}
          >
            {
              initialUCA !== null &&
                <Select 
                  useBasicStyles 
                  placeholder="Select UCA"
                  options={ucaList}
                  isInvalid={isEmpty}
                  onChange={(data) => setSelectedUCA(data.value)}
                  defaultValue={ucaList[initialUCA]}
                />
            }
            <FormErrorMessage>Please select your name</FormErrorMessage>
          </Box>
          <Button type="submit" onClick={onSubmit}>Start</Button>
        </Box>
      </FormControl>
    </Box>
  );
}

export default HomePage