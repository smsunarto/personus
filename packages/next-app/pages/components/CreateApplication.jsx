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

function CreateApplication() {
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

  const { config, error } = usePrepareContractWrite({
    addressOrName: personusAddress,
    contractInterface: contractAbi,
    functionName: "createApplication",
    args: [1231],
  });

  const {
    data: postData,
    isLoading: postIsLoading,
    isSuccess: postIsSuccess,
    write,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: postData?.hash,
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
  }, [isSuccess, isLoading, postIsSuccess, postData, toast]);

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
              Now, let's request some vote from genesis members to get you in.
            </Text>
          </Flex>

          <Button
            isLoading={postIsLoading || isLoading}
            fontWeight={"700"}
            onClick={() => write()}
            isDisabled={!write}
          >
            Request Vote
          </Button>
          <Text>
            {id && isSuccess
              ? `Your application ID is ${id}`
              : "Waiting for transaction..."}
          </Text>
        </Stack>
      </Container>
    </>
  );
}

export default CreateApplication;
