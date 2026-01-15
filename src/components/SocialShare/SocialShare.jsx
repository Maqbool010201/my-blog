"use client";

import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  LinkedinShareButton, LinkedinIcon,
  WhatsappShareButton, WhatsappIcon
} from "next-share";

export default function SocialShare({ title, url, image }) {
  if (!url) return null; // Don't render until URL exists

  const shareTitle = `Check out this article: ${title}`;

  return (
    <div className="flex flex-col gap-4 my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
      <div className="flex flex-wrap gap-3 justify-start">
        <FacebookShareButton url={url} quote={shareTitle} hashtag="#WiseMixMedia">
          <FacebookIcon size={48} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={shareTitle} via="WiseMixMedia">
          <TwitterIcon size={48} round />
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={title} summary={shareTitle} source={url}>
          <LinkedinIcon size={48} round />
        </LinkedinShareButton>

        <WhatsappShareButton url={url} title={shareTitle} separator=":: ">
          <WhatsappIcon size={48} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
}
