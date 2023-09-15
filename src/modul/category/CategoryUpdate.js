import Button from "components/button/Button";
import Radio from "components/checkbox/Radio";
import Field from "components/field/Field";
import Input from "components/input/Input";
import Label from "components/label/Label";
import { db } from "firebase-app/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus } from "utils/constants";

const CategoryUpdate = () => {
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({ mode: "onChange" });

  /// step 1: get category  & display category from firebase

  useEffect(() => {
    async function fetchingData() {
      const colRef = doc(db, "categories", categoryId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
    }
    fetchingData();
  }, [categoryId, reset]);

  /// step2: update category
  const handleCategoryUpdate = async (values) => {
    const colRef = doc(db, "categories", categoryId);
    await updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.slug || values.name, { lower: true }),
      status: Number(values.status),
    });
    toast.success("Update category success!");
  };

  const watchStatus = watch("status");

  if (!categoryId) return null;

  return (
    <div>
      <DashboardHeading
        title="Update Category"
        desc={`Update category id:${categoryId}`}
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCategoryUpdate)}>
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <div className="flex flex-wrap gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                onClick={() => setValue("status", "approved")}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                onClick={() => setValue("status", "unapproved")}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </div>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[250px]"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update Category
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
