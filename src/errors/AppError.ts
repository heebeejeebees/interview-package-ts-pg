class AppError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }

  public getMessage(): string {
    return this.message;
  }
}

export default AppError;
