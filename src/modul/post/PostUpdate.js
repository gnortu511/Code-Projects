import Button from "components/button/Button";
import Radio from "components/checkbox/Radio";
import { Dropdown } from "components/dropdown";
import Field from "components/field/Field";
import ImageUpload from "components/image/ImageUpload";
import Input from "components/input/Input";
import Label from "components/label/Label";
import Toggle from "components/toggle/Toggle";
import { db } from "firebase-app/firebase-config";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { postStatus } from "utils/constants";
import axios from "axios";

Quill.register("modules/imageUploader", ImageUploader);
const PostAddNewStyles = styled.div``;
const PostUpdate = () => {
  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });
  const [categoryUi, setCategoryUi] = useState("");
  const [categories, setCategories] = useState([]);
  const watchHot = watch("hot");
  const watchStatus = watch("status");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  // get post id
  const [params] = useSearchParams();
  const postId = params.get("id");

  // url imgpost from fireSote
  const imgUrl = getValues("urlImage");
  const imageRegex = /%2F(\S+)\?/gm.exec(imgUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const {
    progessStyle,
    urlImage,
    selectImage,
    handleDeleteImage,
    setUrlImage,
  } = useFirebaseImage(setValue, getValues, imageName, deleteImgPost);
  useEffect(() => {
    setUrlImage(imgUrl);
  }, [setUrlImage, imgUrl]);

  async function deleteImgPost() {
    const colRef = doc(db, "post", postId);
    await updateDoc(colRef, {
      urlImage: "",
    });
  }

  // get display post

  useEffect(() => {
    async function fetchingData() {
      if (!postId) return;
      const colRef = doc(db, "post", postId);
      const docPost = await getDoc(colRef);
      reset(docPost?.data() && docPost?.data());
      console.log("docPost data", docPost.data());
      setCategoryUi(docPost?.data().category.name || "");
      setContent(docPost?.data().content || "");
    }
    fetchingData();
  }, [postId, reset]);

  //get category
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

  // select category and display
  const handleSelectCategory = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setCategoryUi(item.name);
  };

  //update post
  const handleUpdatePost = async (values) => {
    setLoading(true);
    if (!isValid) return;
    const colRef = doc(db, "post", postId);
    await updateDoc(colRef, {
      ...values,
      urlImage,
      content,
    });
    setLoading(false);
    setUrlImage("");
    toast.success("Update post successfully!");
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: "https://api.imgbb.com/1/upload?key=63339f636e9b690469d2a7dacb08f631",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  if (!postId) return null;
  return (
    <PostAddNewStyles>
      <DashboardHeading
        title="Update post"
        desc="Update post"
      ></DashboardHeading>

      <form onSubmit={handleSubmit(handleUpdatePost)}>
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

        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
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
          Update post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostUpdate;
