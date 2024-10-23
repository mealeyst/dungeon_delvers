export interface IUser {
  _id: string
  name: string
  email: string
  password_hash: string
  salt: string
}

export interface IUserInputDTO {
  name: string
  email: string
  password_hash: string
}
