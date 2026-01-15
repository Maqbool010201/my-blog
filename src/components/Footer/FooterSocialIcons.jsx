'use client';

import {
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from 'phosphor-react';

const icons = {
  facebook: FacebookLogo,
  twitter: TwitterLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  youtube: YoutubeLogo,
};

export default function FooterSocialIcons({ links }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <div className="flex space-x-4 mt-4" aria-label="Social media links">
      {links.map((social) => {
        const Icon = icons[social.platform?.toLowerCase()];
        if (!Icon || !social.url) return null;

        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${social.platform}`}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <Icon size={24} weight="fill" />
          </a>
        );
      })}
    </div>
  );
}
