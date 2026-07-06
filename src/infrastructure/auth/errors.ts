export class AuthError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "AuthError"
    this.status = status
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Unauthorized") {
    super(message, 401)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Forbidden") {
    super(message, 403)
    this.name = "ForbiddenError"
  }
}
