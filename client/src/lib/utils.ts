import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { type AuthUser } from "aws-amplify/auth";
import { type BaseQueryFn, type BaseQueryApi } from "@reduxjs/toolkit/query";
import { type FetchBaseQueryError, type FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `₹${kValue}k+` : `<₹${kValue}k`;
  }
  return isMin ? `₹${value}+` : `<₹${value}`;
}


export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value]
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

type IdTokenPayload = {
  email?: string;
  [key: string]: any;
};

type CreateUserResponse = {
  error?: undefined;
  data: unknown;
  meta?: FetchBaseQueryMeta;
};

type CreateUserBody = {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
};

type CreateUserArgs = {
  url: string;
  method: string;
  body: CreateUserBody;
};

export const createNewUserInDatabase = async (
  user: AuthUser,
  idToken: { payload: IdTokenPayload },
  userRole: string,
  fetchWithBQ: BaseQueryFn<CreateUserArgs, unknown, FetchBaseQueryError>
): Promise<CreateUserResponse> => {
  const createEndpoint =
    userRole?.toLowerCase() === "manager" ? "/managers" : "/tenants";

  console.log("Creating user with endpoint:", createEndpoint);
  console.log("User data:", {
    cognitoId: user.userId,
    name: user.username,
    email: idToken?.payload?.email,
  });

  try {
    const createUserResponse = await fetchWithBQ(
      {
        url: createEndpoint,
        method: "POST",
        body: {
          cognitoId: user.userId,
          name: user.username,
          email: idToken?.payload?.email || "",
          phoneNumber: "",
        },
      },
      { signal: new AbortController().signal } as BaseQueryApi,
      {}
    ) as CreateUserResponse;

    console.log("Create user response:", createUserResponse);

    if (createUserResponse.error) {
      console.error("Failed to create user:", createUserResponse.error);
      throw new Error(`Failed to create user record: ${JSON.stringify(createUserResponse.error)}`);
    }

    return createUserResponse;
  } catch (error) {
    console.error("Error in createNewUserInDatabase:", error);
    throw error;
  }
};
