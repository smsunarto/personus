import { Heading, Container, Text, Flex, Link, Code } from "@chakra-ui/react";
import React from "react";

function Hero() {
  return (
    <>
      <Container maxW={"1100px"} h={"15vh"} px={"2rem"}>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
          w={"100%"}
          py={"4rem"}
        >
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Heading fontWeight={"700"}>Welcome to&nbsp;</Heading>
            <Link
              color={"#0070f3"}
              isExternal
              href="https://github.com/smsunarto/personus"
            >
              <Heading fontWeight={"700"}>Personus</Heading>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </>
  );
}

export default Hero;
