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

export default function TargetSelector({ value, options = {}, onChange = () => {} }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [target, setTarget] = useState(value);
  const targets = Object.values(options);

  const applyChanges = () => {
    onChange(target);
    onClose();
  }

  const buildSelector = () => {
    const selectorOptions = targets.map(target => {
      const { name } = target

      return <option key={name} value={name}>
        {name}
      </option>
    });

    return (
      <Select
        value={target}
        onChange={(e) => setTarget(e.target.value)}>
        {selectorOptions}
      </Select>
    );
  };

  return (
    <>
      <Link color="teal" onClick={onOpen}>
        <Text fontSize="lg">{value}</Text>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Target Selector</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="target">
              <FormLabel>Select desired target</FormLabel>
              { buildSelector() }
              <FormHelperText>
                Product will be installed in selected target
              </FormHelperText>
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
