import type { NextApiRequest, NextApiResponse } from 'next'
import openGraphScraper from 'open-graph-scraper';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { url } = req.query;
    if (typeof url === 'string') {
      const options = {
        url,
        onlyGetOpenGraphInfo: false,
        customMetaTags: [
          {
            fieldName: 'twitterCard',
            multiple: false,
            property: 'twitter:card'
          },
          {
            fieldName: 'twitterCard',
            multiple: false,
            property: 'twitter:site'
          },
          {
            fieldName: 'twitterCard',
            multiple: false,
            property: 'twitter:title'
          },
          {
            fieldName: 'twitterCard',
            multiple: false,
            property: 'twitter:description'
          },
          {
            fieldName: 'twitterCard',
            multiple: false,
            property: 'twitter:image'
          },
        ]
      };
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
        // ogTitleがなく,twitterTitleがある場合はtwitterTitleをogTitleにする
        if (!data.ogTitle && data.twitterTitle) {
          data.ogTitle = data.twitterTitle;
        }
        // ogImageがなく,twitterImageがある場合はtwitterImageをogImageにする
        if (!data.ogImage && data.twitterImage) {
          data.ogImage = data.twitterImage;
        }
        // ogDescriptionがなく,twitterDescriptionがある場合はtwitterDescriptionをogDescriptionにする
        if (!data.ogDescription && data.twitterDescription) {
          data.ogDescription = data.twitterDescription;
        }
        // ogUrlがなく,requestUrlがある場合はrequestUrlをogUrlにする
        if (!data.ogUrl && data.requestUrl) {
          data.ogUrl = data.requestUrl;
        }
        // ogImageもなく、twitterImageもなく、faviconがある場合はfaviconをogImageにする
        if (!data.ogImage && !data.twitterImage && data.favicon) {
          data.ogImage = [
            {
              url: data.favicon,
            }
          ];
        }
        return res.status(200).json(data);
      }
      return res.status(404).json({ message: 'Not Found' });
    }
  }
  res.status(400).json({ message: 'Bad Request' });
}