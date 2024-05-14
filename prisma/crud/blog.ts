import prisma from "@/prisma";


/**
 * Blogを作成する
 */
interface CreateBlogProps {
  title: string;
  description?: string;
  content: string;
  image: string;
  keywords?: string;
  status?: number;
}
export const createBlog = async ({ title, content, keywords, description, image, status }: CreateBlogProps) => {
  const blog = await prisma.blog.create({
    data: {
      title,
      description,
      image,
      content,
      keywords,
      status,
    },
  });
  return blog;
}

/**
 * すべてのBlogを取得す
 * ※Statusが1のもののみ取得する
 */
export const getBlogs = async (isAdmin=false) => {
  // 管理者の場合はすべてのBlogを取得する
  if (isAdmin) {
    const blogs = await prisma.blog.findMany();
    return blogs;
  }
  const blogs = await prisma.blog.findMany({
    where: {
      status: 1,
    },
  });
  return blogs;
}

/**
 * Blogを更新する
 */
interface UpdateBlogProps extends CreateBlogProps {
  id: string;
}
export const updateBlog = async (props: UpdateBlogProps) => {
  const { id, title, content, keywords, description, image, status } = props;
  const blog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      image,
      content,
      keywords,
      status,
    },
  });
  return blog;
}

/**
 * Blogを削除する
 * @param id
 */
export const deleteBlog = async (id: string) => {
  const Blog = await prisma.blog.delete({
    where: {
      id,
    },
  });
}

/**
 * Blogを取得する
 * @param id
 */
export const getBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return blog;
}
