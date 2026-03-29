export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'change_this_secret',
  expiresIn: '7d',
}
