import type { NextApiRequest, NextApiResponse } from 'next'
import openGraphScraper from 'open-graph-scraper';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { url } = req.query;
    if (typeof url === 'string') {
      const options = { url, onlyGetOpenGraphInfo: true };
      const data = await openGraphScraper(options)
        .then((data) => {
          // OGP によるデータ取得が失敗した場合
          if (!data.result.success) {
            return null;
          }
          // OGP によるデータ取得が成功した場合
          return data.result;
        })
        .catch((error) => {
          return null;
        });
      if (data) {
        return res.status(200).json(data);
      }
      return res.status(404).json({ message: 'Not Found' });
    }
  }
  res.status(200).json({ name: 'John Doe' })
}