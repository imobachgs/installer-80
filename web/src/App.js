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
  useInstallerState, useInstallerDispatch, loadStorage, loadL10n, loadSoftware, setOptions, loadOptions
} from './context/installer';

function App() {
  const dispatch = useInstallerDispatch();
  const { storage, l10n, software } = useInstallerState();

  useEffect(() => {
    loadStorage(dispatch);
    loadL10n(dispatch);
    loadSoftware(dispatch);
    loadOptions(dispatch);
  }, []);

  const proposal = [
    {"mount":"/boot/efi","device":"/dev/sda1","type":"vfat","size":536870912},
    {"mount":"/","device":"/dev/sda2","type":"btrfs","size":997518737408},
    {"mount":"swap","device":"/dev/sda4","type":"swap","size":2148212224}
  ];

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
                options={storage.devices}
                onChange={(device) => setOptions({ device }, dispatch)}
              />
              <Proposal data={proposal}/>
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
