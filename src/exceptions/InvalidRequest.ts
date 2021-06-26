import HttpException from "./HttpException";

export default class InvalidRequestException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
