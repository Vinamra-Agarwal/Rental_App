"use client";

import Loading from "@/src/components/Loading";
import SettingsForm from "@/src/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/src/state/api";
import React from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  console.log("authUser:", authUser);
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return < Loading />;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
        cognitoId: authUser?.cognitoInfo?.userId,
        ...data,
    })
  }
  return (
    <div className="dashboard-container">
    <SettingsForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        userType="tenant"
    />
    </div>
  );
};

export default TenantSettings;
