import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Box, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Heading } from "@chakra-ui/react";
import { useLoginUserMutation } from "../generated/graphql";
import NextLink from "next/link";
import Layout from "../components/layout";

export default function Login() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState,
    setError,
    errors,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = useLoginUserMutation({
    onSettled: (data) => {
      // user failed to login -> errors returned from server
      if (data?.loginUser?.errors?.field) {
        const field = data.loginUser?.errors?.field;
        const message = data.loginUser?.errors?.message as string | undefined;

        setError(field as "email" | "password", {
          message,
        });
      }
      // user successfully login
      else {
        router.replace("/");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
    reset();
    return;
  });

  return (
    <Layout>
      <Heading my="4">Login</Heading>

      <form onSubmit={onSubmit}>
        <FormControl isInvalid={errors.email ? true : false}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter email"
            ref={register({ required: true })}
            name="email"
            id="email"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password ? true : false}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            ref={register({ required: true })}
            name="password"
            id="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Box my="2">
          <NextLink href="/forgot-password">
            <Link mr="4">Forgot Password?</Link>
          </NextLink>

          <NextLink href="/register">
            <Link>Create New Account</Link>
          </NextLink>
        </Box>

        <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
          Login
        </Button>
      </form>
    </Layout>
  );
}
