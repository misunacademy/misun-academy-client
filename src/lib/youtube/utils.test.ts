import { describe, it, expect } from "vitest";
import {
  buildDrivePreviewUrl,
  buildYouTubeWatchUrl,
  extractDriveId,
  extractVideoId,
  formatQualityLabel,
  formatTime,
  isDriveUrl,
  normalizeVideoId,
  resolveVideoSource,
  youtubeErrorMessage,
} from "@/lib/youtube/utils";

describe("extractVideoId", () => {
  it("accepts bare ids and rejects empty input", () => {
    expect(extractVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId(null)).toBeNull();
    expect(extractVideoId(undefined)).toBeNull();
    expect(extractVideoId("   ")).toBeNull();
  });

  it("parses watch, youtu.be, embed, shorts, live and nocookie URLs", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("ignores extra params", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=PLx")).toBe("dQw4w9WgXcQ");
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ?si=abcdef")).toBe("dQw4w9WgXcQ");
  });

  it("rescues double-wrapped watch?v=<url> values", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("returns null for non-youtube input and never mistakes a Drive id", () => {
    expect(extractVideoId("https://example.com/video")).toBeNull();
    expect(extractVideoId("not a video at all")).toBeNull();
    expect(extractVideoId("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs")).toBeNull();
  });
});

describe("extractDriveId", () => {
  const driveId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs";

  it("accepts bare ids and /file/d/ links", () => {
    expect(extractDriveId(driveId)).toBe(driveId);
    expect(extractDriveId(`https://drive.google.com/file/d/${driveId}/view?usp=sharing`)).toBe(driveId);
  });

  it("accepts open?id= links", () => {
    expect(extractDriveId(`https://drive.google.com/open?id=${driveId}`)).toBe(driveId);
  });

  it("rejects non-drive input and 11-char youtube ids", () => {
    expect(extractDriveId(null)).toBeNull();
    expect(extractDriveId("https://example.com/file/d/abc")).toBeNull();
    expect(extractDriveId("dQw4w9WgXcQ")).toBeNull();
  });
});

describe("isDriveUrl / resolveVideoSource", () => {
  it("detects drive urls", () => {
    expect(isDriveUrl("https://drive.google.com/file/d/x/view")).toBe(true);
    expect(isDriveUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
    expect(isDriveUrl(null)).toBe(false);
  });

  it("lets an explicit source win", () => {
    expect(resolveVideoSource({ url: "https://youtu.be/dQw4w9WgXcQ", videoSource: "googledrive" })).toBe("googledrive");
    expect(
      resolveVideoSource({ url: "https://drive.google.com/file/d/x/view", videoSource: "youtube" })
    ).toBe("youtube");
  });

  it("infers drive from drive urls or bare drive ids", () => {
    expect(resolveVideoSource({ url: "https://drive.google.com/file/d/x/view" })).toBe("googledrive");
    expect(resolveVideoSource({ videoId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs" })).toBe("googledrive");
  });

  it("defaults to youtube", () => {
    expect(resolveVideoSource({})).toBe("youtube");
    expect(resolveVideoSource({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" })).toBe("youtube");
  });
});

describe("normalizeVideoId / builders / formatters", () => {
  it("strips urls down to raw ids and never returns a url", () => {
    expect(normalizeVideoId("youtube", "https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(normalizeVideoId("youtube", "dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(normalizeVideoId("youtube", null)).toBe("");
  });

  it("builds watch and preview urls", () => {
    expect(buildYouTubeWatchUrl("dQw4w9WgXcQ")).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(buildDrivePreviewUrl("abc123")).toBe("https://drive.google.com/file/d/abc123/preview");
  });

  it("formats time and quality labels", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(600)).toBe("10:00");
    expect(formatQualityLabel("hd720")).toBe("720p");
    expect(formatQualityLabel("unknown-level")).toBe("UNKNOWN-LEVEL");
  });

  it("maps youtube error codes to messages", () => {
    expect(youtubeErrorMessage(100)).toMatch(/unavailable/i);
    expect(youtubeErrorMessage(101)).toMatch(/embedding/i);
    expect(youtubeErrorMessage(null)).toMatch(/try again later/i);
    expect(youtubeErrorMessage(999)).toMatch(/try again later/i);
  });
});
