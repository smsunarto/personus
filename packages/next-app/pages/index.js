import Header from "./Header";
import { Identity } from "@semaphore-protocol/identity";
import React, { useState, useCallback, useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import CreateApplication from "./components/CreateApplication";
import {
  useToast,
  Button,
  Box,
  Divider,
  HStack,
  Container,
  Link,
  OrderedList,
  ListItem,
  Text,
  Icon,
} from "@chakra-ui/react";

function IconAddCircleFill({ width, height, color }) {
  return (
    <Icon width={width} height={height} color={color}>
      <path
        fill="currentColor"
        d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"
      />
    </Icon>
  );
}

function IconRefreshLine({ width, height, color }) {
  return (
    <Icon width={width} height={height} color={color}>
      <path
        fill="currentColor"
        d="M5.463 4.43301C7.27756 2.86067 9.59899 1.99666 12 2.00001C17.523 2.00001 22 6.47701 22 12C22 14.136 21.33 16.116 20.19 17.74L17 12H20C20.0001 10.4316 19.5392 8.89781 18.6747 7.58927C17.8101 6.28072 16.5799 5.25517 15.1372 4.64013C13.6944 4.0251 12.1027 3.84771 10.56 4.13003C9.0172 4.41234 7.59145 5.14191 6.46 6.22801L5.463 4.43301ZM18.537 19.567C16.7224 21.1393 14.401 22.0034 12 22C6.477 22 2 17.523 2 12C2 9.86401 2.67 7.88401 3.81 6.26001L7 12H4C3.99987 13.5684 4.46075 15.1022 5.32534 16.4108C6.18992 17.7193 7.42007 18.7449 8.86282 19.3599C10.3056 19.9749 11.8973 20.1523 13.44 19.87C14.9828 19.5877 16.4085 18.8581 17.54 17.772L18.537 19.567Z"
      />
    </Icon>
  );
}

export default function Home() {
  const toast = useToast();
  const [_identity1, setIdentity1] = useState();
  const [_identity2, setIdentity2] = useState();
  const [_identity3, setIdentity3] = useState();
  const [_identity4, setIdentity4] = useState();

  useEffect(() => {
    const identityString1 = localStorage.getItem("personus-identity-1");
    const identityString2 = localStorage.getItem("personus-identity-2");
    const identityString3 = localStorage.getItem("personus-identity-3");
    const identityString4 = localStorage.getItem("personus-identity-4");

    if (identityString1) {
      const identity1 = new Identity(identityString1);
      const identity2 = new Identity(identityString2);
      const identity3 = new Identity(identityString3);
      const identity4 = new Identity(identityString4);
      setIdentity1(identity1);
      setIdentity2(identity2);
      setIdentity3(identity3);
      setIdentity4(identity4);
    }

    toast({
      title: "Connect Wallet",
      description: "Connect your wallet to get started",
      status: "info",
      duration: 4000,
      isClosable: false,
      position: "bottom-right",
    });
  }, []);

  const createIdentity = useCallback(async () => {
    const identity1 = new Identity();
    const identity2 = new Identity();
    const identity3 = new Identity();
    const identity4 = new Identity();

    setIdentity1(identity1);
    setIdentity2(identity2);
    setIdentity3(identity3);
    setIdentity4(identity4);

    localStorage.setItem("personus-identity-1", identity1.toString());
    localStorage.setItem("personus-identity-2", identity2.toString());
    localStorage.setItem("personus-identity-3", identity3.toString());
    localStorage.setItem("personus-identity-4", identity4.toString());
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <Container
        mb={"5em"}
        border="1px solid #CBD5E0"
        rounded={"10px"}
        p={"2em"}
        align={"left"}
      >
        <Text pt="2" fontSize="md">
          Users interact with the protocol using a Semaphore{" "}
          <Link
            href="https://semaphore.appliedzkp.org/docs/guides/identities"
            color="primary.500"
            isExternal
          >
            identity
          </Link>{" "}
          (similar to Ethereum accounts). It contains three values:
        </Text>
        <OrderedList pl="20px" pt="5px" spacing="3">
          <ListItem>Trapdoor: private, known only by user</ListItem>
          <ListItem>Nullifier: private, known only by user</ListItem>
          <ListItem>Commitment: public</ListItem>
        </OrderedList>
        <Divider pt="5" borderColor="gray.500" />

        <HStack pt="5" justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Your Personal Identity
          </Text>
          {_identity1 && (
            <Button
              leftIcon={<IconRefreshLine />}
              variant="link"
              color="text.700"
              onClick={createIdentity}
            >
              New
            </Button>
          )}
        </HStack>

        {_identity1 ? (
          <>
            <Box py="6" whiteSpace="nowrap">
              <Box
                p="5"
                borderWidth={1}
                borderColor="gray.500"
                borderRadius="4px"
              >
                <Text textOverflow="ellipsis" overflow="hidden">
                  Trapdoor: {_identity1.trapdoor.toString()}
                </Text>
                <Text textOverflow="ellipsis" overflow="hidden">
                  Nullifier: {_identity1.nullifier.toString()}
                </Text>
                <Text textOverflow="ellipsis" overflow="hidden">
                  Commitment: {_identity1.commitment.toString()}
                </Text>
              </Box>
            </Box>
          </>
        ) : (
          <Box py="6">
            <Button
              w="100%"
              fontWeight="bold"
              justifyContent="left"
              bgColor={"primary.500"}
              px="4"
              onClick={createIdentity}
              leftIcon={<IconAddCircleFill />}
            >
              Create identity
            </Button>
          </Box>
        )}
      </Container>

      <CreateApplication />
    </>
  );
}
