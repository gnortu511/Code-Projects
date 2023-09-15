import React, { useEffect, useState } from "react";
import Label from "../components/label/Label";
import { useForm } from "react-hook-form";
import Input from "../components/input/Input";
import IconEyeClose from "../components/icon/IconEyeClose";
import Field from "../components/field/Field";
import IconEyeOpen from "../components/icon/IconEyeOpen";
import Button from "../components/button/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";

// validation form register
const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your eamil"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 character or greater")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [togglePassowrd, setTogglePassword] = useState(true);

  // function register
  const handleSignUp = async (values) => {
    console.log("values", values);
    //submit handle -> 1 cai promis
    if (!isValid) return;
    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
      photoURL:
        "https://static2.yan.vn/YanNews/202109/202109010932200727-7297b374-9071-4166-b50c-5492410a3f74.jpeg",
    });
    const colRef = collection(db, " users");
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: slugify(values.fullname, { lower: true }),
      avatar:
        "https://static2.yan.vn/YanNews/202109/202109010932200727-7297b374-9071-4166-b50c-5492410a3f74.jpeg",
      status: userStatus.APPROVED,
      role: userRole.USER,
      createdAt: serverTimestamp(),
    });
    // addDoc(colRef, {
    //   fullname: values.fullname,
    //   email: values.email,
    //   password: values.password,
    // });
    toast.success("Register account success!");
    navigate("/sign-in");
  };

  // display error by tossify
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
      <form className="form" onSubmit={handleSubmit(handleSignUp)}>
        <Field>
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            type="text"
            placeholder="Enter your fullname"
            className="input"
            name="fullname"
            id="fullname"
            control={control}
          ></Input>
        </Field>

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
          You already have an account?{" "}
          <NavLink to={"/sign-in"} className="text-red-500 text-lg">
            Login
          </NavLink>{" "}
        </div>
        <Button
          type="submit"
          style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
