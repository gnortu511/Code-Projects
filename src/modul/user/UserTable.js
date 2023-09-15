import { ActionDelete, ActionEdit } from "components/action";
import { LabelStatus } from "components/label";
import Table from "components/table/Table";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  // get userList
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(result);
    });
  }, []);

  // display userstatus
  const renderUserStatus = (status) => {
    switch (status) {
      case userStatus.APPROVED:
        return <LabelStatus type="success">APPROVED</LabelStatus>;

      case userStatus.PENDING:
        return <LabelStatus type="warning">PENDING</LabelStatus>;

      case userStatus.BAN:
        return <LabelStatus type="danger">BAN</LabelStatus>;

      default:
        break;
    }
  };

  // delete user
  const handleDeleteUser = (user) => {
    const colRef = doc(db, "users", user.id);

    //confirm delete user
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
        //await deleteUser(user);
        toast.success("delete user success!");
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const renderUserRole = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "ADMIN";
      case userRole.MOD:
        return "MOD";
      case userRole.USER:
        return "USER";

      default:
        break;
    }
  };

  //display userlist
  const renderUserList = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-3">
          <img
            src={user?.avatar}
            alt=""
            className="w-10 h-10 flex-shrink-0 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3>{user.fullname}</h3>
            <time className="text-sm text-gray-300">
              {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString(
                "vi-VI"
              )}
            </time>
          </div>
        </div>
      </td>
      <td>{user?.username}</td>
      <td title={user.email}>{user.email.slice(0, 5) + "..."}</td>
      <td>{user?.status && renderUserStatus(user.status)}</td>
      <td>{user?.role && renderUserRole(user.role)}</td>
      <td>
        <div className="flex gap-5 text-gray-400">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
        </div>
      </td>
    </tr>
  );
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserList(user))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
