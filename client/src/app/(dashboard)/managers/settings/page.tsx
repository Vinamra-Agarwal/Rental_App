"use client";

import Loading from "@/src/components/Loading";
import SettingsForm from "@/src/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/src/state/api";
import React from "react";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  console.log("authUser:", authUser);
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (isLoading) return <Loading />;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
        cognitoId: authUser?.cognitoInfo?.userId,
        ...data,
    })
  }
  return (
    <div className="dashboard-container">
    <SettingsForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        userType="manager"
    />
    </div>
  );
};

export default ManagerSettings;
