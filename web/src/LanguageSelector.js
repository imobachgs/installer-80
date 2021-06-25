import React, { useState } from 'react';

import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

export default function LanguageSelector({ selected, onChange = () => {} }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [language, setLanguage] = useState(selected);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "de", name: "Deutsch" },
    { code: "ch", name: "中文" },
    { code: "fr", name: "Français" }
  ];

  const languageOptions = () => {
    return languages.map(lang => (
      <option key={lang.code} value={lang.code}>
        {lang.name}
      </option>
    ));
  };

  const applyChanges = () => {
    onChange(language);
    onClose();
  }

  const labelFor = (langCode) => {
    const result = languages.find(lang => lang.code == langCode);
    const name = result ? result.name : "none selected yet";

    return name;
  }

  return (
    <>
      <Link color="teal" onClick={onOpen}>
        <Text fontSize="lg">{labelFor(language)}</Text>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Language Selector</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="language">
              <FormLabel>Selet desired language</FormLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}>
                { languageOptions() }
              </Select>
              <FormHelperText>The selected language will be used for both, the installer
      and the installed system</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={applyChanges}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
