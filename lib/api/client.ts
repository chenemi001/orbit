export interface ApiRequestOptions
  extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | undefined
  >;
}

function buildUrl(
  url: string,
  params?: ApiRequestOptions["params"]
) {
  if (!params) return url;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  );

  const query = searchParams.toString();

  return query
    ? `${url}?${query}`
    : url;
}

export async function apiClient<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { params, ...requestOptions } =
    options;

  const response = await fetch(
    buildUrl(url, params),
    {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json",
        ...requestOptions.headers,
      },
    }
  );

  if (!response.ok) {
    let errorBody: unknown;

    try {
      errorBody = await response.json();
    } catch {
      errorBody = undefined;
    }

    throw new Error(
      typeof errorBody === "object" &&
        errorBody !== null &&
        "message" in errorBody
        ? String(
            (
              errorBody as {
                message: string;
              }
            ).message
          )
        : `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(
    url: string,
    options?: ApiRequestOptions
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "GET",
    }),

  post: <T>(
    url: string,
    body?: unknown,
    options?: ApiRequestOptions
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(
    url: string,
    body?: unknown,
    options?: ApiRequestOptions
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(
    url: string,
    body?: unknown,
    options?: ApiRequestOptions
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(
    url: string,
    options?: ApiRequestOptions
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "DELETE",
    }),
};