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

export default function ProductSelector({ value, options = {}, onChange = () => {} }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [product, setProduct] = useState(value);
  const products = Object.values(options);

  const applyChanges = () => {
    onChange(product);
    onClose();
  }

  const label = () => {
    if (products.size == 0) {
      return value;
    }

    const selectedProduct = products.find(p => p.name == value)

    return selectedProduct ? selectedProduct.display_name : value;
  }

  const buildSelector = () => {
    const selectorOptions = products.map(p => (
      <option key={p.name} value={p.name}>
        {p.display_name}
      </option>
    ));

    return (
      <Select
        value={product}
        onChange={(e) => setProduct(e.target.value)}>
        {selectorOptions}
      </Select>
    );
  };

  return (
    <>
      <Link color="teal" onClick={onOpen}>
        <Text fontSize="lg">{label()}</Text>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Selector</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="product">
              <FormLabel>Select the product to be installed</FormLabel>
              { buildSelector() }
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
