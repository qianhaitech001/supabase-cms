import { createHash, createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildMediaStoragePath,
  buildUpyunPublicUrl,
  createUpyunAuthorizationHeader,
  getMediaUploadProvider
} from "../lib/media-storage";

describe("media storage provider", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("supports UpYun as an upload provider", () => {
    vi.stubEnv("MEDIA_UPLOAD_PROVIDER", "upyun");
    expect(getMediaUploadProvider()).toBe("upyun");
  });

  it("falls back to Supabase for unknown providers", () => {
    vi.stubEnv("MEDIA_UPLOAD_PROVIDER", "unknown");
    expect(getMediaUploadProvider()).toBe("supabase");
  });

  it("builds stable storage paths with safe names", () => {
    expect(buildMediaStoragePath("hello world(1).png", "/uploads/admin/", 123)).toBe("uploads/admin/123-hello-world-1-.png");
  });

  it("builds UpYun public URLs from the configured CDN domain", () => {
    expect(buildUpyunPublicUrl("https://inshowhome.metainshow.com/", "/uploads/admin/image.png")).toBe(
      "https://inshowhome.metainshow.com/uploads/admin/image.png"
    );
  });

  it("creates the expected UpYun authorization header", () => {
    const input = {
      method: "PUT",
      uri: "/inshowhome/uploads/admin/hero.jpg",
      date: "Tue, 30 Jun 2026 08:00:00 GMT",
      contentMd5: "a1b2c3",
      operator: "operator",
      password: "password"
    };
    const passwordMd5 = createHash("md5").update(input.password).digest("hex");
    const signature = createHmac("sha1", passwordMd5)
      .update(`${input.method}&${input.uri}&${input.date}&${input.contentMd5}`)
      .digest("base64");

    expect(createUpyunAuthorizationHeader(input)).toBe(`UPYUN operator:${signature}`);
  });

  it("matches the UpYun Node SDK signature fixture without optional headers", () => {
    expect(
      createUpyunAuthorizationHeader({
        method: "POST",
        uri: "/bucket",
        operator: "operator",
        password: "password"
      })
    ).toBe("UPYUN operator:Xx3G6+DAvUyCL2Y2npSW/giTFI8=");
  });

  it("creates an UpYun upload signature without Content-MD5 by default", () => {
    const input = {
      method: "PUT",
      uri: "/inshowhome/uploads/admin/hero.jpg",
      date: "Tue, 30 Jun 2026 08:00:00 GMT",
      operator: "operator",
      password: "password"
    };
    const passwordMd5 = createHash("md5").update(input.password).digest("hex");
    const signature = createHmac("sha1", passwordMd5).update(`${input.method}&${input.uri}&${input.date}`).digest("base64");

    expect(createUpyunAuthorizationHeader(input)).toBe(`UPYUN operator:${signature}`);
  });
});
