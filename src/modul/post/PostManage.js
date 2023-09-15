import { ActionDelete, ActionEdit, ActionView } from "components/action";
import Button from "components/button/Button";
import { Dropdown } from "components/dropdown";
import { LabelStatus } from "components/label";
// import Pagination from "components/pagination/Pagination";
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
import { debounce } from "lodash";

import DashboardHeading from "modul/dashboard/DashboardHeading";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postStatus } from "utils/constants";

const CATEGORY_PER_PAGE = 1;
const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const handleLoadMorePost = async () => {
    console.log("1");
    const nextRef = query(
      collection(db, "post"),
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
      setPostList([...postList, ...result]);
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
      const colRef = collection(db, "post");

      // search category
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
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

      // display realtime post
      onSnapshot(newRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(result);
      });

      // cập nhật lastVisble
      setLastDoc(lastVisible);
    }
    fetchingData();
  }, [filter]);
  console.log("postList", postList);

  // status post

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">APPROVED</LabelStatus>;

      case postStatus.PENDING:
        return <LabelStatus type="warning">PENDING</LabelStatus>;

      case postStatus.REJECTED:
        return <LabelStatus type="danger">REJECTED</LabelStatus>;

      default:
        break;
    }
  };

  // delete post
  const handleDeletePost = async (postId) => {
    const colRef = doc(db, "post", postId);

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

  const handleFilterSearch = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  //phan quyen
  // const { userInfo } = useAuth();
  // if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Category"></Dropdown.Select>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleFilterSearch}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((post) => (
              <tr key={post.id}>
                <td title={post.id}>{post.id.slice(0, 5) + "..."}</td>
                <td className="!pr-[100px]">
                  <div className="flex items-center gap-x-3 w-full ">
                    <img
                      src={post.urlImage}
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <time className="text-sm text-gray-500">
                        Date:
                        {new Date(
                          post?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{post.category.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{post.user.fullname}</span>
                </td>
                <td>{post?.status && renderPostStatus(post.status)}</td>
                <td>
                  <div className="flex gap-5 text-gray-400">
                    <ActionView
                      onClick={() => navigate(`/${post.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${post.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(post.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div className="mt-10">
        {total > postList.length && (
          <div className="mt-10">
            <Button onClick={handleLoadMorePost} className="mx-auto">
              Load more
            </Button>
            {total}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManage;
