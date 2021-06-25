import React, { useEffect, useState } from 'react';

import {
  ChakraProvider,
  Box,
  Text,
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
import LanguageSelector from './LanguageSelector';

// FIXME: improve how icons are managed
import {
  Archive,
  HardDrive,
  Languages,
} from 'lucide-react';

import {
  useInstallerState, useInstallerDispatch, loadDisks, loadLanguages, loadProducts, loadOptions, setOptions
} from './context/installer';

function App() {
  const dispatch = useInstallerDispatch();
  const { disks, languages = [], products } = useInstallerState();

  console.log("Disks", disks);
  console.log("Languages", languages);
  console.log("Products", products);

  useEffect(() => {
    loadDisks(dispatch);
    loadLanguages(dispatch);
    loadProducts(dispatch);
    loadOptions(dispatch);
  }, []);

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

            <Category title="Language" icon={Languages}>
              <LanguageSelector
                value="en_US"
                options={languages}
                onChange={(lang) => console.log("Selected language", lang)} />
            </Category>

            <Category title="Product" icon={Archive}>
              <Text>microOS</Text>
            </Category>

            <Category title="Target" icon={HardDrive}>
              <Text>/dev/sda</Text>
            </Category>
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
