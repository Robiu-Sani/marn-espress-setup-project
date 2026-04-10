export interface IAuth {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  email?: string;
  _id: string;
  password: string;
}
