import DashboardHeading from "modul/dashboard/DashboardHeading";
import React from "react";
import UserTable from "./UserTable";
import Button from "components/button/Button";

const UserManage = () => {
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button kind="ghost" height="60px" to="/manage/add-user">
          Create user
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
