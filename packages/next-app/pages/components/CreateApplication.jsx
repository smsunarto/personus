import {
  Button,
  Container,
  Flex,
  Input,
  Skeleton,
  Divider,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  useContractWrite,
  useContractEvent,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { personusAddress } from "../../utils/contractAddress";
import contractAbi from "../../contracts/ABI/Personus.json";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";

function CreateApplication() {
  const [_identity, setIdentity] = useState();
  const [id, setId] = useState();
  const toast = useToast();

  useContractEvent({
    addressOrName: personusAddress,
    contractInterface: contractAbi,
    eventName: "NewApplication",
    listener(e) {
      console.log(e[1]);
      setId(e[1]);
    },
  });

  const { config } = usePrepareContractWrite({
    addressOrName: personusAddress,
    contractInterface: contractAbi,
    functionName: "createApplication",
    args: [_identity?.commitment.toString()],
  });

  const { config: joinGroupConfig } = usePrepareContractWrite({
    addressOrName: personusAddress,
    contractInterface: contractAbi,
    functionName: "joinGroup",
    args: [
      _identity?.commitment.toString(),
      "0",
      ethers.utils.formatBytes32String("foobar"),
    ],
  });

  const {
    data: postData,
    isLoading: postIsLoading,
    isSuccess: postIsSuccess,
    write,
  } = useContractWrite(config);

  const {
    data: postData2,
    isLoading: postIsLoading2,
    isSuccess: postIsSuccess2,
    write: write2,
  } = useContractWrite(joinGroupConfig);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: postData?.hash,
  });

  const { isLoading2, isSuccess2 } = useWaitForTransaction({
    hash: postData2?.hash,
  });

  useEffect(() => {
    isLoading &&
      toast({
        title: "Transaction Sent",
        description: postData?.hash,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    isSuccess &&
      toast({
        title: "Transaction Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    isLoading2 &&
      toast({
        title: "Transaction Sent",
        description: postData2?.hash,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    isSuccess2 &&
      toast({
        title: "Transaction Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    const identityString = localStorage.getItem("personus-identity-1");

    setIdentity(new Identity(identityString));
  }, [
    isSuccess,
    isLoading,
    isSuccess2,
    isLoading2,
    postIsSuccess,
    postIsSuccess2,
    postData,
    postData2,
    toast,
  ]);

  return (
    <>
      <Container
        mb={"5em"}
        border="1px solid #CBD5E0"
        rounded={"10px"}
        p={"2em"}
        align={"center"}
      >
        <Stack spacing={"1em"} align={"center"}>
          <Flex w={"60%"} justifyContent={"space-around"} alignItems={"center"}>
            <Text>
              First, let's create an application so the genesis members can vote
              you in.
            </Text>
          </Flex>

          <Button
            isLoading={postIsLoading || isLoading}
            fontWeight={"700"}
            onClick={() => write()}
            isDisabled={!write}
          >
            Create Application
          </Button>
          <Text>
            {id && isSuccess
              ? `Your application ID is ${id}`
              : "Waiting for transaction..."}
          </Text>
          <br></br>
          <Divider borderColor="#CBD5E0" />
          <br></br>

          <Flex w={"60%"} justifyContent={"space-around"} alignItems={"center"}>
            <Text>
              You have to wait until three members vouched for your application,
              afterwards you can click the button below to submit your identity
              commitment to Personus.
            </Text>
          </Flex>

          <Button
            isLoading={postIsLoading2 || isLoading2}
            fontWeight={"700"}
            onClick={() => write()}
            isDisabled={!write2}
          >
            Join Personus Group
          </Button>
          <Text>
            {isSuccess2
              ? `Welcome to Personus!. Your identity commitment is ${_identity.commitment}`
              : "Waiting for transaction..."}
          </Text>
        </Stack>
      </Container>
    </>
  );
}

export default CreateApplication;
