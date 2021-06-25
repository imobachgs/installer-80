import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Heading,
  Flex,
  Spacer,
  Divider,
  Button,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import Category from './Category';

// FIXME: improve how icons are managed
import {
  Archive,
  HardDrive,
  Languages,
  Play,
} from 'lucide-react';

function App() {
  return (
    <ChakraProvider theme={theme}>
        <Box minH="100vh" p={3}>
          <Flex>
            <Spacer />
            <ColorModeSwitcher />
          </Flex>
          <VStack spacing={8}>
            <Heading as="h1">Welcome to $INSTALLER-80</Heading>
            <Divider />

            <Category title="Language" icon={Languages} description="Spanish" />
            <Category title="Product" icon={Archive} description="microOS" />
            <Category title="Target" icon={HardDrive} description="/dev/sda" />
            <Category title="Bootloader" icon={Play} description="Grub2" />

          </VStack>

          <Flex p={20}>
            <Spacer />
            <Button colorScheme="teal" size="lg">
              Install
            </Button>
          </Flex>
        </Box>
    </ChakraProvider>
  );
}

export default App;
