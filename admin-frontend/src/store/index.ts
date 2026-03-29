export interface AdminState {
  username: string
  loggedIn: boolean
}

export const adminStore: AdminState = {
  username: 'admin',
  loggedIn: false,
}
