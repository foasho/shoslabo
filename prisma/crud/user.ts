import prisma from '../prisma';

export const getUsers = async () => {
  return await prisma.user.findMany({});
}

// Idを指定してユーザーを取得
export const getUserById = async (
  id: string
) => {
  return await prisma.user.findFirst({
    where: {
      id: id,
    }
  });
}

// WalletAddressを指定してユーザーを取得
export const getUserByAddress = async (
  address: string
) => {
  return await prisma.user.findFirst({
    where: {
      address: address,
    }
  });
}

export const getOrCreateUserByAdress = async (
  address: string,
  name: string = "No Name",
  image: string = "/img/user-thumbnail.png"
) => {
  const user = await getUserByAddress(address);
  if (user) {
    return user;
  } else {
    return await createUser({ address, name, image });
  }
}

export const createUser = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (id: string, data: any) => {
  return await prisma.user.update({
    where: {
      id: id
    },
    data,
  });
}

export const deleteUser = async id => {
  const user = await prisma.user.delete({
    where: {
      id
    }
  })
  return user
}