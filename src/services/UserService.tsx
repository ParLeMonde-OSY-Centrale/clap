import React, { useState } from "react";

import { axiosRequest } from "src/components/axiosRequest";
import { User } from "types/user.type";

type UserServiceFunc = Promise<{ success: boolean; errorCode: number }>;

interface UserServiceContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login(username: string, password: string, remember: boolean): UserServiceFunc;
  axiosLoggedRequest(_req: any): Promise<void>;
  signup(user: User, inviteCode?: string): UserServiceFunc;
  updatePassword(user: User): UserServiceFunc;
  verifyEmail(user: User): UserServiceFunc;
  logout(): Promise<void>;
}

export const UserServiceContext = React.createContext<UserServiceContextValue>(undefined);

interface UserServiceProviderProps {
  user: User | null;
  children: React.ReactNodeArray;
}

export const UserServiceProvider: React.FunctionComponent<UserServiceProviderProps> = ({ user: initialUser, children }: UserServiceProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);

  /**
   * Login the user with username and password.
   * Return a number 0 -> success or not.
   * @param username
   * @param password
   * @param remember
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const login = async (username: string, password: string, remember: boolean = false): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login",
      data: {
        username,
        password,
        getRefreshToken: remember,
      },
    });
    if (response.error) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }

    setUser(response.data.user || null);
    return {
      success: true,
      errorCode: 0,
    };
  };

  const logout = async (): Promise<void> => {
    // TODO;
  };

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = async (user: User, inviteCode?: string): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      url: "/users",
      data: {
        inviteCode,
        ...user,
      },
    });
    if (response.error) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    return {
      success: true,
      errorCode: 0,
    };
  };

  /**
   * Updates the user password.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const updatePassword = async (user: User): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/update-password",
      data: {
        ...user,
      },
    });
    if (response.error) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    return {
      success: true,
      errorCode: 0,
    };
  };

  /**
   * Verifies the user email.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const verifyEmail = async (user: User): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/verify-email",
      data: {
        ...user,
      },
    });
    if (response.error) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    return {
      success: true,
      errorCode: 0,
    };
  };

  const logoutSessionExpired = async () => {
    // TODO;
  };

  const refreshAccessToken = async () => {
    // TODO;
  };

  /**
   * Do an Axios logged request to the backend with the csrf token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const axiosLoggedRequest = async (_req: any): Promise<void> => {
    // TODO;
  };

  const isLoggedIn = user !== null;

  return (
    <UserServiceContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        axiosLoggedRequest,
        signup,
        updatePassword,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </UserServiceContext.Provider>
  );
};