import { getUsers, getUserByAddress, createUser, updateUser, deleteUser, getUserById } from "@/crud/user";
import { getSession } from 'next-auth/react';

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id) {
          // Get a single user if id is provided is the query
          // api/users?id=1
          const user = await getUserById(req.query.id)
          return res.status(200).json(user)
        }
        else if (req.query.address) {
          // Get a single user if address is provided is the query
          // api/users?address=0x1234
          const user = await getUserByAddress(req.query.address)
          return res.status(200).json(user)
        }
        else {
          // Otherwise, fetch all users
          const users = await getUsers()
          return res.json(users)
        }
      }
      case 'POST': {
        const session = await getSession({ req: { headers: req.headers } });
        {/** @ts-ignore */ }
        const address = session.address as string;
        if (address) {
          // Create a new user
          const { email, name } = req.body
          const user = await createUser({ email, name, address });
          return res.json(user)
        }
      }
      case 'PUT': {
        // Update an existing user
        const session = await getSession({ req: { headers: req.headers } });
        const { ...updateData } = req.body;
        {/** @ts-ignore */ }
        const userId = session?.user.id as string;
        const user = await updateUser(userId, updateData)
        return res.json(user)
      }
      case 'DELETE': {
        // Delete an existing user
        const { id } = req.body
        const user = await deleteUser(id)
        return res.json(user)
      }
      default:
        break
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message })
  }
}