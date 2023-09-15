import Button from "components/button/Button";
import Radio from "components/checkbox/Radio";
import Field from "components/field/Field";
import FieldCheckboxes from "components/field/FieldCheckboxes";
import ImageUpload from "components/image/ImageUpload";
import Input from "components/input/Input";
import Label from "components/label/Label";
import { auth, db } from "firebase-app/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";

const UserAddNew = () => {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.APPROVED,
      role: userRole.USER,
      createdAt: serverTimestamp(),
    },
  });
  const watchStatus = watch("status");
  const watchRole = watch("role");

  const {
    progessStyle,
    urlImage,
    selectImage,
    handleDeleteImage,
    setUrlImage,
  } = useFirebaseImage(setValue, getValues);

  // add user
  const handleAddUser = async (values) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);

      await addDoc(collection(db, "users"), {
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
        createdAt: serverTimestamp(),
      });
      toast.success(`create user add data with email ${values.email} success!`);
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        status: userStatus.APPROVED,
        role: userRole.USER,
        createdAt: serverTimestamp(),
      });
      setUrlImage();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddUser)}>
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
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
