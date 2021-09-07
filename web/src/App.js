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
import Proposal from './Proposal';

// FIXME: improve how icons are managed
import {
  Archive,
  HardDrive,
  Languages,
} from 'lucide-react';

import {
  useInstallerState, useInstallerDispatch, loadStorage, loadL10n, loadSoftware, loadDisks, setOptions, loadOptions
} from './context/installer';

function App() {
  const dispatch = useInstallerDispatch();
  const { storage, l10n, software } = useInstallerState();

  useEffect(() => {
    loadStorage(dispatch);
    loadDisks(dispatch);
    loadL10n(dispatch);
    loadSoftware(dispatch);
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
                value={l10n.language}
                options={l10n.languages}
                onChange={(language) => setOptions({ language }, dispatch)} />
            </Category>

            <Category title="Target" icon={HardDrive}>
              <TargetSelector
                value={storage.device || "Select a device"}
                options={storage.disks}
                onChange={device => setOptions({ device }, dispatch)}
              />
              <Proposal data={storage.proposal}/>
            </Category>

            <Category title="Product" icon={Archive}>
              <ProductSelector
                value={software.product || "Select a product"}
                options={software.products}
                onChange={(product) => setOptions({ product }, dispatch)}
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
