import prisma from "@/prisma";


/**
 * Articleを作成する
 */
interface CreateArticleProps {
  title: string;
  content: string;
  keywords?: string;
}
export const createArticle = async (props: CreateArticleProps) => {
  const { title, content, keywords } = props;
  const article = await prisma.article.create({
    data: {
      title,
      content,
      keywords,
    },
  });
  return article;
}

/**
 * Articleを更新する
 */
interface UpdateArticleProps extends CreateArticleProps {
  id: string;
}
export const updateArticle = async (props: UpdateArticleProps) => {
  const { id, title, content, keywords } = props;
  const article = await prisma.article.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      keywords,
    },
  });
  return article;
}

/**
 * Articleを削除する
 * @param id
 */
export const deleteArticle = async (id: string) => {
  const article = await prisma.article.delete({
    where: {
      id,
    },
  });
}

/**
 * Articleを取得する
 * @param id
 */
export const getArticle = async (id: string) => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
  });
  return article;
}
