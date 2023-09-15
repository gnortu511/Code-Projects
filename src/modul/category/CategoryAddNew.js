import Button from "components/button/Button";
import Radio from "components/checkbox/Radio";
import Field from "components/field/Field";
import Input from "components/input/Input";
import Label from "components/label/Label";
import { db } from "firebase-app/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus } from "utils/constants";

const CategoryAddNew = () => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: 2,
    },
  });

  // add category
  const handleCategoryAddNew = async (values) => {
    //console.log(values);

    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.name, { lower: true });
      cloneValues.status = Number(values.status);

      const colRef = collection(db, "categories");
      await addDoc(colRef, {
        ...cloneValues,
        createdAt: serverTimestamp(),
      });
      toast.success("add new category success!");
      reset({
        name: "",
        slug: "",
        status: 2,
      });
      console.log(cloneValues);
    } catch (error) {
      console.log(error);
    }

    //console.log(cloneValues);
  };

  const watchStatus = watch("status");
  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCategoryAddNew)}>
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
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
