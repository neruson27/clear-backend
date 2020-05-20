import bcrypt from 'bcrypt'

export function passwordMatch(inputPassword, current) {
  // si el password es distinto
  // !bcrypt.compare(password, user.password)) return null
  return bcrypt.compareSync(inputPassword, current);
}

export function createPassword (password) {
  return bcrypt.hashSync(password, 13);
}