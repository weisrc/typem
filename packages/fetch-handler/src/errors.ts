import type { ValidationError } from "@typem/predicate";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
  }

  toResponse(): Response {
    return new Response(
      JSON.stringify({
        error: {
          code: this.code,
          message: this.message,
          details: this.details,
        },
      }),
      {
        status: this.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export class ExtractorValidationError extends HttpError {
  public static status: number = 400;
  public static message: string = "Validation failed";
  public static code: string = "validation_error";

  constructor(
    public readonly id: string,
    public readonly param: any,
    public readonly errors: ValidationError[]
  ) {
    super(
      ExtractorValidationError.status,
      ExtractorValidationError.message,
      ExtractorValidationError.code,
      {
        id,
        param,
        errors,
      }
    );
  }
}

export class UndefinedOutputError extends HttpError {
  public static status: number = 404;
  public static message: string = "Not found";
  public static code: string = "not_found";
  public static details: unknown = undefined;

  constructor() {
    super(
      UndefinedOutputError.status,
      UndefinedOutputError.message,
      UndefinedOutputError.code,
      UndefinedOutputError.details
    );
  }
}
