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
import TargetSelector from './TargetSelector';
import ProductSelector from './ProductSelector';

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
  const { disks, languages = [], products, options } = useInstallerState();

  console.log("Options", options);
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
                value={options.language}
                options={languages}
                onChange={(language) => setOptions({ language })} />
            </Category>

            <Category title="Target" icon={HardDrive}>
              <TargetSelector
                value={options.disk || "SELECT ONE"}
                options={disks}
                onChange={(target) => setOptions({ target })}
              />
            </Category>

            <Category title="Product" icon={Archive}>
              <ProductSelector
                value={options.product || "SELECT ONE"}
                options={products}
                onChange={(product) => setOptions({ product })}
              />
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
