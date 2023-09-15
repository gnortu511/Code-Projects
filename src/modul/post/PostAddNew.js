import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Field from "../../components/field/Field";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import Radio from "../../components/checkbox/Radio";
import Button from "../../components/button/Button";
import slugify from "slugify";
import { postStatus } from "../../utils/constants";

import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { Dropdown } from "components/dropdown";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";
import DashboardHeading from "modul/dashboard/DashboardHeading";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      category: {},
      urlImage: "",
      user: {},
      hot: false,
    },
  });
  const watchStatus = watch("status");
  // const watchCategory = watch("categoryId");
  const watchHot = watch("hot");

  //select image
  const {
    progessStyle,
    urlImage,
    selectImage,
    handleDeleteImage,
    setUrlImage,
  } = useFirebaseImage(setValue, getValues);

  const [categories, setCategories] = useState([]);
  const [categoryUi, setCategoryUi] = useState("");
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  console.log("userInfo", userInfo);

  useEffect(() => {
    async function fetchingUserData() {
      if (!userInfo.email) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapShot = await getDocs(q);
      querySnapShot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchingUserData();
  }, [setValue, userInfo.email]);
  // add new post
  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "post");
      await addDoc(colRef, {
        ...cloneValues,
        urlImage,
        userId: cloneValues.user.id,
        categoryId: cloneValues.category.id,
        createdAt: serverTimestamp(),
      });
      console.log(cloneValues);
      // handleUploadImage(cloneValues.image);

      toast.success("Create new post success");
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        urlImage: "",
        user: {},
        hot: false,
      });
      setUrlImage("");
      setCategoryUi("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // uploadImage

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));

      const querySnapShot = await getDocs(q);
      let result = [];
      querySnapShot.forEach((doc) => {
        // console.log(doc.id, "=>", doc.data());
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);

  // select category
  const handleSelectCategory = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setCategoryUi(item.name);
  };
  // console.log(categories);

  useEffect(() => {
    document.title = "Monkey-Bloging Add-Post";
  });
  return (
    <PostAddNewStyles>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>

      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={selectImage}
              progress={progessStyle}
              image={urlImage}
              className="h-[250px] upload-image"
              handleDeleteImage={handleDeleteImage}
            ></ImageUpload>
          </Field>

          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={categoryUi || "Select the category"}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleSelectCategory(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>

          <Field>
            <Label>Status</Label>
            <div className="flex items-center gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                onClick={() => setValue("status", "approved")}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                onClick={() => setValue("status", "pending")}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                onClick={() => setValue("status", "reject")}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </div>
          </Field>
        </div>

        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disabled={loading}
        >
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
