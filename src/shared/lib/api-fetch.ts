export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options
  const isFormData = body instanceof FormData
  const hasBody = body !== undefined

  const res = await fetch(url, {
    ...rest,
    body: isFormData ? body : hasBody ? JSON.stringify(body) : undefined,
    headers: {
      ...(isFormData || !hasBody ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    let details: unknown
    try {
      const parsed: unknown = await res.json()
      if (
        parsed &&
        typeof parsed === "object" &&
        "error" in parsed &&
        typeof (parsed as { error?: unknown }).error === "string"
      ) {
        message = (parsed as { error: string }).error
      }
      details = parsed
    } catch {
      // Non-JSON error body (e.g. empty response) — fall back to generic message.
    }
    throw new ApiError(message, res.status, details)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
