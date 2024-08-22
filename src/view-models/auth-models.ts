export class SignInModel {
  email: string = ''
  password: string = ''
}

export class SignInErrorModel {
  email: string | null = null
  password: string | null = null
}

export class SignUpModel {
  email: string = ''
  nickname: string = ''
  password: string = ''
  passwordConfirm: string = ''
}

export class SignUpErrorModel {
  email: string | null = null
  nickname: string | null = null
  password: string | null = null
  passwordConfirm: string | null = null
}
