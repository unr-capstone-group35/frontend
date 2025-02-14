export interface LoginResponse {
  token: string
}

export interface SignUpRequest {
  email: string
  username: string
  password: string
}

export interface SignUpResponse {
  username: string
  email: string
}

export interface SignInRequest {
  username: string
  password: string
}

export interface SignInResponse {
  username: string
  email: string
  token: string
  expiresAt: string
}
