<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 6587ccf ([web] Add a language selector component)
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
  Play,
} from 'lucide-react';

import {
  useInstallerState, useInstallerDispatch, loadProducts, loadLanguages
} from './context/installer';

function App() {
  const dispatch = useInstallerDispatch();
  const { languages, products } = useInstallerState();
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    loadLanguages(dispatch);
    loadProducts(dispatch);
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
                selected={currentLanguage}
                onChange={setCurrentLanguage} />
            </Category>

            <Category title="Product" icon={Archive}>
              <Text>microOS</Text>
            </Category>

            <Category title="Target" icon={HardDrive}>
              <Text>/dev/sda</Text>
            </Category>

            <Category title="Bootloader" icon={Play}>
              <Text>Grub2</Text>
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
