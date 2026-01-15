// src/lib/utils.js
import slugify from "slugify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function makeSlug(text) {
  return slugify(text || "", { lower: true, strict: true }).slice(0, 200);
}

export function timeAgo(date) {
  if (!date) return "";
  return dayjs(date).fromNow();
}
