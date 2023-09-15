import { ActionDelete, ActionEdit, ActionView } from "components/action";
import Button from "components/button/Button";
import { LabelStatus } from "components/label";
import Table from "components/table/Table";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import DashboardHeading from "modul/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { categoryStatus } from "utils/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const CATEGORY_PER_PAGE = 1;

const CategoryManage = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);

  const handleLoadMoreCategory = async () => {
    console.log("1");
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc),
      limit(CATEGORY_PER_PAGE)
    );

    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoriesList([...categoriesList, ...result]);
    });

    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  // display category in Category Manage
  useEffect(() => {
    async function fetchingData() {
      console.log("2");
      const colRef = collection(db, "categories");

      // search category
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));

      /// load page chưa có giá trị cuát lastVisible lastVisible => nên cần đoạn code này
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      ///

      //
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      //

      // display realtime category
      onSnapshot(newRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoriesList(result);
      });

      // cập nhật lastVisble
      setLastDoc(lastVisible);
    }
    fetchingData();
  }, [filter]);

  // Action delete category

  const handleDeleteCategory = async (docId) => {
    const colRef = doc(db, "categories", docId);

    // confirm delete category
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });

    // console.log(docData.data());
  };

  // getvalue filter
  const handleFilterSearch = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button kind="ghost" height="60px" to="/manage/add-category">
          Create Category
        </Button>
      </DashboardHeading>
      <div className="mb-10 flex justify-end">
        <div className="max-w-[190px] w-full">
          <input
            type="text"
            className="w-full p-5 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleFilterSearch}
          ></input>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoriesList.length > 0 &&
            categoriesList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <em className="text-gray-400">{item.slug}</em>
                </td>
                <td>
                  {Number(item.status) === categoryStatus.APPROVED && (
                    <LabelStatus type="success">APPROVED</LabelStatus>
                  )}
                  {Number(item.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">UNAPPROVED</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex gap-5 text-gray-400">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > categoriesList.length && (
        <div className="mt-10">
          <Button onClick={handleLoadMoreCategory} className="mx-auto">
            Load more
          </Button>
          {total}
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
