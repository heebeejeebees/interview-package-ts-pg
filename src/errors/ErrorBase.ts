class ErrorBase extends Error {
  private errorCode: number;
  private httpStatusCode: number;

  constructor(message: string, errorCode: number, httpStatusCode: number) {
    super();

    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }

  public getMessage(): string {
    return this.message;
  }

  public getErrorCode(): number {
    return this.errorCode;
  }

  public getHttpStatusCode(): number {
    return this.httpStatusCode;
  }
}

export default ErrorBase;
