/**
 * This file was automatically generated by `@sdutacm/onlinejudge3-api-sdk`.
 */

import * as Contract_Verification from '../../common/contracts/verification';

export class ApiVerificationModule<R> {
  constructor(private readonly apiRequest: any) {}

  /**
   * API sendEmailVerification.
   * @param req {Contract_Verification.ISendEmailVerificationReq} The request data.
   * @param options {R} Extra request options.
   * @returns {Promise<Contract_Verification.ISendEmailVerificationResp>} The response data.
   * @throws {ApiException} If the API call fails.
   * @throws {HttpException} If the HTTP request fails.
   * @throws {Error} If unknown error occurs.
   */
  sendEmailVerification(req: Contract_Verification.ISendEmailVerificationReq, options?: R): Promise<Contract_Verification.ISendEmailVerificationResp> {
    return this.apiRequest('sendEmailVerification', req, options);
  }
}
