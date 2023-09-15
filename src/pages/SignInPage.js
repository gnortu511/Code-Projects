import React, { useEffect, useState } from "react";
import AuthenticationPage from "./AuthenticationPage";
import IconEyeClose from "../components/icon/IconEyeClose";
import IconEyeOpen from "../components/icon/IconEyeOpen";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import Label from "../components/label/Label";
import Input from "../components/input/Input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import { useAuth } from "../contexts/auth-context";
import { NavLink, useNavigate } from "react-router-dom";
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Your password must be least 8 character or greater")
    .required("Please enter your password!"),
});
const SignInPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [togglePassowrd, setTogglePassword] = useState(true);

  const { userInfo } = useAuth();
  console.log(userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    // if (!userInfo.email) {
    //   navigate("/sign-up");
    // } else {
    //   navigate("/");
    // }
  }, []);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    navigate("/");
  };

  //display error
  useEffect(() => {
    const errArray = Object.values(errors);
    if (errArray.length > 0) {
      toast.error(errArray[0]?.message, {
        delay: 100,
        pauseOnHover: false,
      });
    }
  }, [errors]);
  return (
    <AuthenticationPage>
      <form className="form" onSubmit={handleSubmit(handleSignIn)}>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="input"
            name="email"
            id="email"
            control={control}
          ></Input>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type={togglePassowrd ? "password" : "text"}
            placeholder="Enter your password"
            className="input"
            name="password"
            id="password"
            control={control}
          >
            {togglePassowrd ? (
              <IconEyeClose
                onClick={() => setTogglePassword(false)}
              ></IconEyeClose>
            ) : (
              <IconEyeOpen
                onClick={() => setTogglePassword(true)}
              ></IconEyeOpen>
            )}
          </Input>
        </Field>
        <div className="have-account mb-10">
          You have not had an account?{" "}
          <NavLink to={"/sign-up"} className="text-red-500 text-lg">
            Register an account
          </NavLink>{" "}
        </div>
        <Button
          type="submit"
          style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
