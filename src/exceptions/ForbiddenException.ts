import HttpException from "./HttpException";

export default class ForbiddenException extends HttpException {
  constructor() {
    super(403, "Forbidden");
  }
}
