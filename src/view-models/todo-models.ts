export class TodoModel {
  id: string | null = null
  createTime: number = 0
  content: string = ''
  status: boolean = false
}

export class TodoErrorModel {
  content: string | null = null
}
