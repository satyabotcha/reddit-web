import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Heading } from "@chakra-ui/react";
import { useResetPasswordMutation } from "../../generated/graphql";
import Layout from "../../components/layout";

export default function Login() {
  const {
    query: { token },
  } = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState,
    setError,
    errors,
  } = useForm({
    defaultValues: {
      password: "",
    },
  });
  const { mutate } = useResetPasswordMutation({
    onSettled: (data) => {
      // user failed to reset password -> errors returned from server
      if (data?.resetPassword?.errors?.field) {
        const field = data.resetPassword?.errors?.field;
        const message = data.resetPassword?.errors?.message as
          | string
          | undefined;

        setError(field as "password", {
          message,
        });
      }
      // user successfully changed password -> redirect them to login page
      else {
        router.push("/login");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate({
      token: token as string,
      newPassword: data.password,
    });
    reset();
    return;
  });

  return (
    <Layout>
      <Heading mx="4">Reset Password</Heading>

      <form onSubmit={onSubmit}>
        <FormControl isInvalid={errors.password ? true : false}>
          <FormLabel>New password</FormLabel>
          <Input
            type="password"
            placeholder="Enter new password"
            ref={register({ required: true })}
            name="password"
            id="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button mt="4" type="submit" isLoading={formState.isSubmitting}>
          Change Password
        </Button>
      </form>
    </Layout>
  );
}
