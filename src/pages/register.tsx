import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../generated/graphql";
import { Heading } from "@chakra-ui/react";
import Layout from "../components/layout";

export default function Register() {
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
      username: "",
      password: "",
      email: "",
    },
  });
  const { mutate } = useCreateUserMutation({
    onSettled: (data) => {
      // user failed to register -> errors returned from server
      if (data?.createUser?.errors?.field) {
        const field = data.createUser?.errors?.field;
        const message = data.createUser?.errors?.message as string | undefined;

        setError(field as "username" | "password", {
          message,
        });
      }
      // user successfully registered
      else {
        router.push("/login");
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
      <Heading my="4">Register</Heading>
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

        <FormControl isInvalid={errors.username ? true : false}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter username"
            ref={register({ required: true })}
            name="username"
            id="username"
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
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

        <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
          Register
        </Button>
      </form>
    </Layout>
  );
}
