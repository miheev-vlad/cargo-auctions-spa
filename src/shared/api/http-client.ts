import { API_BASE_URL } from "../config/constants";

export class ApiRequestError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message =
      (body as { message?: string } | undefined)?.message ??
      response.statusText;
    throw new ApiRequestError(response.status, body, message);
  }

  return body as TResponse;
}

export const httpClient = {
  post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse>(path, { method: "POST", body: JSON.stringify(body) }),
  get: <TResponse>(path: string) => request<TResponse>(path, { method: "GET" }),
};
