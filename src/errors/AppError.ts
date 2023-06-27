class AppError extends Error {
  private httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super();

    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }

  public getMessage(): string {
    return this.message;
  }

  public getHttpStatusCode(): number {
    return this.httpStatusCode;
  }
}

export default AppError;
