import { NextResponse } from 'next/server';
import { getUsers, getUserByAddress, createUser, updateUser, deleteUser, getUserById } from "@/crud/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const address = searchParams.get('address');
  if (id) {
    // Get a single user if id is provided is the query
    // api/users?id=1
    const user = await getUserById(id);
    return NextResponse.json(user);
  }
  else if (address) {
    // Get a single user if address is provided is the query
    // api/users?address=0x1234
    const user = await getUserByAddress(address);
    return NextResponse.json(user);
  }
  // Otherwise, fetch all users
  const users = await getUsers();
  return NextResponse.json(users);
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  {/** @ts-ignore */ }
  const address = session.address as string;
  if (address) {
    // Create a new user
    const { email, name } = await req.json();
    const user = await createUser({ email, name, address });
    return NextResponse.json(user);
  }
  return NextResponse.json({ message: 'Missing address' }, { status: 400 });
}

export async function PUT(req: Request) {
  // Update an existing user
  const session = await getServerSession(authOptions);
  const { ...updateData } = req.body;
  {/** @ts-ignore */ }
  const userId = session?.user.id as string;
  const user = await updateUser(userId, updateData)
  return NextResponse.json(user)
}

export async function DELETE(req: Request) {
  // Delete an existing user
  const { id } = await req.json();
  const user = await deleteUser(id);
  return NextResponse.json(user);
};