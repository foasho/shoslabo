import React, { useEffect, useState, useRef, useMemo } from "react";
import { MdOpenInNew } from "react-icons/md";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Loading2D } from "./Loading2D";

interface OGData {
  ogDescription: string;
  ogImage: any[];
  ogSiteName: string;
  ogTitle: string;
  ogType: string;
  ogUrl: string;
  requestUrl: string;
  success: boolean;
  twitterCard: string;
  twitterCreator: string;
  twitterSite: string;
}


export const SNSLinkPreview = ({ text }: { text: string }) => {
  const [isTwitter, setIsTwitter] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  const [isAny, setIsAny] = useState(false);
  const [ogData, setOgData] = useState<OGData|null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (hasTwitterUrl(text)) {
      setIsTwitter(true);
    }
    else if (hasYoutubeUrl(text)) {
      setIsYoutube(true);
    }
    else {
      setIsAny(true);
    }
  }, [text]);

  const getOGdata = async (url: string) => {
    const data = await fetch(`/api/blog/getog?url=${url}`).then(
      (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return null;
      },
      (err) => null,
    )
    if (data) {
      setOgData(data);
    }
  }

  useEffect(() => {
    if (isAny && text.includes("https://")) {
      getOGdata(text);
      setIsMounted(true);
    }
    else if (isAny) {
      setIsMounted(true);
    }
  }, [isAny, text]);

  const domain = useMemo(() => {
    if (ogData) {
      try {
        const url = new URL(ogData.ogUrl);
        return url.origin;
      } catch (error) {
        console.log(error);
      }
    }
    return "";
  }, [ogData]);

  return (
    <>
      {isTwitter && <EmbedTwitter text={text} />}
      {isYoutube && <EmbedYoutube text={text} />}
      {isAny && ogData && 
        <div className="block w-3/4 mx-auto cursor-pointer mb-3" onClick={
          () => window.open(text, "_blank")
        }>
          <div className="flex space-x-4 px-2 py-3 items-start border border-gray-300 rounded-lg relative">
            <div className="w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48">
              <img
                src={ 
                  (ogData.ogImage && ogData.ogImage.length > 0) ? 
                    ogData?.ogImage[0].url.includes("http") ? ogData?.ogImage[0].url : `${domain}${ogData?.ogImage[0].url}`
                    : 
                    "/icons/blank.png"
                }
                alt={ogData?.ogTitle}
                className="object-cover h-full w-full rounded-lg my-auto mx-auto"
              />
            </div>
            <div className="flex-1 space-y-2 overflow-hidden max-h-32">
              <div className="font-bold xl:text-lg md:text-md text-sm whitespace-normal">
                {ogData?.ogTitle}
              </div>
              <p className="text-xs md:text-sm text-gray-700 whitespace-normal">{ogData?.ogDescription}</p>
            </div>
            <a 
              onClick={(e) => window.open(text, "_blank")}
              className="text-[6px] md:text-xs !text-blue-500 whitespace-normal absolute -bottom-4 right-0"
            >
              <span className="!text-blue-500">
                <MdOpenInNew 
                  className="inline-block mr-1"
                />
                {text}
              </span>
            </a>
          </div>
        </div>
      }
      {isAny && isMounted && !ogData &&
        <div className="block w-3/4 mx-auto cursor-pointer mb-3" onClick={
          () => window.open(text, "_blank")
        }>
          <div className="flex space-x-4 px-2 py-3 items-start border border-gray-300 rounded-lg relative">
            <div className="w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48">
              <img
                src={"/icons/404.jpg"}
                alt={"UnKnown"}
                className="object-cover h-full w-full rounded-lg my-auto mx-auto"
              />
            </div>
            <div className="flex-1 space-y-2 overflow-hidden max-h-32">
              <div className="font-bold xl:text-lg md:text-md text-sm whitespace-normal">
                {text}
              </div>
              <p className="text-xs md:text-sm text-gray-700 whitespace-normal"></p>
            </div>
            <a
              onClick={(e) => window.open(text, "_blank")}
              className="text-[6px] md:text-xs whitespace-normal absolute -bottom-4 right-0"
              
            >
              <span className="!text-blue-500">
                <MdOpenInNew
                  className="inline-block mr-1"
                />
                {text}
              </span>
            </a>
          </div>
        </div>
      }
      {isAny && !isMounted &&
        <Loading2D />
      }
    </>
  );
}

/**
 * text内にツイッターURLが含まれているかどうかを判定する
 * @param text
 * @returns
 */
export const hasTwitterUrl = (text: string) => {
  const regexpTweet = /(https?:\/\/twitter\.com\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+\/status\/[0-9]+)/g;
  const tweet = text.match(regexpTweet);
  return Boolean(tweet?.length);
};

/**
 * テキスト内のツイッターURLからツイッターのEmbedコンポーネントを生成する
 * @param text
 * @returns
 */
export type EmbedTwitterProps = {
  text: string;
};
export const EmbedTwitter: React.FC<EmbedTwitterProps> = (props) => {
  const regexpTweet = /(https?:\/\/twitter\.com\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+\/status\/[0-9]+)/g;
  const tweet = props.text.match(regexpTweet);

  if (tweet) {
    return <TwitterTweetEmbed tweetId={tweet[0].split("/")[5]} />;
  }
  return <></>;
};

/**
 * text内にユーチューブURLが含まれているかどうかを判定する
 * @param text
 * @returns
 */
export const hasYoutubeUrl = (text: string) => {
  const regexpYoutube = /(https?:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/g;
  const youtube = text.match(regexpYoutube);
  return Boolean(youtube?.length);
};

/**
 * テキスト内のYouTubeURLからYouTubeのEmbedコンポーネントを生成する
 * @param text
 * @returns
 */
export type EmbedYoutubeProps = {
  text: string;
};

export const EmbedYoutube: React.FC<EmbedYoutubeProps> = (props) => {
  const regexpYoutube = /(https?:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/g;
  const youtube = props.text.match(regexpYoutube);

  if (youtube) {
    const embedUrl = `https://www.youtube.com/embed/${youtube[0].split("=")[1]
      }`;

    return (
      <div
        style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
      >
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, right: 0 }}
        ></iframe>
      </div>
    );
  }
  return <></>;
};

/**
 * text内にCodeSandBoxのURLが含まれているかどうかを判定する
 */
export const hasCodeSandBoxUrl = (text: string) => {
  const regexpCodeSandBox = /(https:\/\/codesandbox\.io\/s\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/g;
  const codeSandBox = text.match(regexpCodeSandBox);
  return Boolean(codeSandBox?.length);
}
