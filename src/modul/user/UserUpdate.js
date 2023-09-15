import Button from "components/button/Button";
import Radio from "components/checkbox/Radio";
import Field from "components/field/Field";
import FieldCheckboxes from "components/field/FieldCheckboxes";
import ImageUpload from "components/image/ImageUpload";
import Input from "components/input/Input";
import Label from "components/label/Label";
import Textarea from "components/textarea/Textarea";
import { db } from "firebase-app/firebase-config";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";

const UserUpdate = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const [params] = useSearchParams();
  const userId = params.get("id");
  const watchStatus = watch("status");
  const watchRole = watch("role");

  // url avatar tu fireSote

  const imgUrl = getValues("avatar");

  const imageRegex = /%2F(\S+)\?/gm.exec(imgUrl);
  // get image_Name for setUrlImage  to  display on screen then get user boi vi luc dau load urlimg  ko co len ko hien thi duoc
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";

  const {
    progessStyle,
    urlImage,
    selectImage,
    handleDeleteImage,
    setUrlImage,
  } = useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  // set url image
  useEffect(() => {
    setUrlImage(imgUrl);
  }, [setUrlImage, imgUrl]);

  // get and display

  useEffect(() => {
    async function fetching() {
      const colRef = doc(db, "users", userId);
      const singleDoc = await getDoc(colRef);
      console.log(singleDoc.data());
      reset(singleDoc?.data() && singleDoc.data());
    }
    fetching();
  }, [userId, reset, urlImage]);

  // delete Image

  async function deleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  // update user

  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, {
          lower: true,
          replacement: " ",
          trim: true,
        }),
        avatar: urlImage,
        status: Number(values.status),
        role: Number(values.role),
        description: values.description,
        createdAt: serverTimestamp(),
      });
      toast.success("update user success!");
    } catch (error) {
      console.log(error);
    }

    console.log(values);
  };
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="mx-auto w-[200px] h-[200px] rounded-full mb-10">
          <ImageUpload
            className="upload-image !rounded-full h-full"
            onChange={selectImage}
            progress={progessStyle}
            image={urlImage}
            handleDeleteImage={handleDeleteImage}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.APPROVED}
                onClick={() => setValue("status", "approved")}
                value={userStatus.APPROVED}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                onClick={() => setValue("status", "pending")}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                onClick={() => setValue("status", "ban")}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                onClick={() => setValue("role", "admin")}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                onClick={() => setValue("role", "mod")}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                onClick={() => setValue("role", "user")}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Description</Label>
            <Textarea name="description" control={control}></Textarea>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update user
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
