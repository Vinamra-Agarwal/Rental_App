import { createNewUserInDatabase } from "../lib/utils";
import { Manager, Tenant } from "../types/prismaTypes";
import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

type User = {
  cognitoInfo: {
    signInDetails?: any;
    username: string;
    userId: string;
  };
  userInfo: Tenant | Manager | undefined;
  userRole: string;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken.toString()}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          console.log("Auth Session:", session);
          console.log("User Role:", userRole);
          console.log("User:", user);

          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          console.log("Fetching user from endpoint:", endpoint);
          let userDetailsResponse = await fetchWithBQ(endpoint);
          console.log("User details response:", userDetailsResponse);

          //if user doesn't exist, create new user
          if (
            userDetailsResponse.error &&
            (userDetailsResponse.error as FetchBaseQueryError).status === 404
          ) {
            console.log("User not found, attempting to create...");
            try {
              userDetailsResponse = await createNewUserInDatabase(
                user,
                { payload: idToken?.payload || {} },
                userRole,
                fetchWithBQ
              );
              console.log("User creation response:", userDetailsResponse);
            } catch (createError) {
              console.error("Error creating user:", createError);
              throw createError;
            }
          }

          if (userDetailsResponse.error) {
            throw userDetailsResponse.error;
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error) {
          console.error("Error in getAuthUser:", error);
          return { 
            error: error as FetchBaseQueryError
          };
        }
      },
    }),

    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
    }),

    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
} = api;
