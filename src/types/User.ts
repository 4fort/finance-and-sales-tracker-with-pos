export interface UserType {
  id: number
  email: string
  name: string
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  customer: string
  email: string
  date: Date
  status: string
  total: number
  items: number
}
