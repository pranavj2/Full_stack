import apiClient from "./apiClient";

export interface AuthResponse {
  message: string;
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export async function registerUser(
  credentials: AuthCredentials,
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    "/auth/register",
    credentials,
  );

  return response.data;
}

export async function loginUser(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );
  console.log("Login response:", response.data); // Log the response data for debugging
  return response.data;
}
