import { Box, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Box w="100%" backgroundColor="grey" color="white" py="4">
        <NextLink href="/" passHref>
          <Link>
            <Heading size="md">Reddit</Heading>
          </Link>
        </NextLink>
      </Box>
      <Box width="50%" mt={8} mx="25%">
        {children}
      </Box>
    </>
  );
}
