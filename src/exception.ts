export class Exception extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Exception';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiException extends Exception {
  code: number;
  msg: string;
  data?: any;

  constructor(code: number, msg: string, data?: any) {
    super(`API Exception: ${msg} (code: ${code})`);
    this.name = 'ApiException';
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

export class HttpException extends Exception {
  status: number;
  statusText: string;
  data?: any;

  constructor(status: number, statusText: string, data?: any) {
    super(`HTTP Exception: ${statusText} (status: ${status})`);
    this.name = 'HttpException';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}
