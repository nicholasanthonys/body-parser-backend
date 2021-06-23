import HttpException from "./HttpException";

export default class BadRequestException extends HttpException {
  constructor(message: string) {
    super(40, message);
  }
}
