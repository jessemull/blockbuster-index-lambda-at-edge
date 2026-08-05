import { CloudFrontRequest, CloudFrontRequestEvent } from "aws-lambda";
import { handler } from "./index";

const getMockEvent = (uri = "/admin", querystring = "") =>
  ({
    Records: [
      {
        cf: {
          request: {
            uri,
            querystring,
            headers: {},
          },
        },
      },
    ],
  }) as unknown as CloudFrontRequestEvent;

describe("Blockbuster Index Lambda@Edge Handler", () => {
  it("should rewrite root URI to /index.html", async () => {
    const event = getMockEvent("/");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result.uri).toBe("/index.html");
  });

  it("should normalize and append .html if no extension", async () => {
    const event = getMockEvent("/about");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });

  it("should leave querystring on the request when adding .html", async () => {
    const event = getMockEvent("/about", "foo=bar");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
    expect(result?.querystring).toBe("foo=bar");
  });

  it("should handle uri with trailing slashes", async () => {
    const event = getMockEvent("/about////");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });

  it("should leave the request unchanged for a malformed URI", async () => {
    const event = getMockEvent("/%zz");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/%zz");
  });

  it("should resolve parent path segments", async () => {
    const event = getMockEvent("/foo/../about");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });

  it("should rewrite paths that normalize to root as /index.html", async () => {
    const event = getMockEvent("/foo/..");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/index.html");
  });

  it("should not append .html when URI already has an extension", async () => {
    const event = getMockEvent("/robots.txt");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/robots.txt");
  });

  it("should lowercase paths without an extension", async () => {
    const event = getMockEvent("/About");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe("/about.html");
  });
});

describe("Redirect logic for canonical domain", () => {
  const getEventWithHost = (
    uri: string,
    host: string,
    proto?: string,
    querystring?: string,
  ) => {
    const headers: Record<string, Array<{ value: string }>> = {
      host: [{ value: host }],
    };
    if (proto) headers["cloudfront-forwarded-proto"] = [{ value: proto }];
    return {
      Records: [
        {
          cf: {
            request: {
              uri,
              headers,
              querystring: querystring || "",
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
  };

  it("redirects root path from blockbusterindex.com to www.blockbusterindex.com", async () => {
    const event = getEventWithHost("/", "blockbusterindex.com");
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/",
          },
        ],
      },
    });
  });

  it("redirects subpage from blockbusterindex.com to www.blockbusterindex.com with .html", async () => {
    const event = getEventWithHost("/about", "blockbusterindex.com");
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/about.html",
          },
        ],
      },
    });
  });

  it("redirects with query string preserved", async () => {
    const event = getEventWithHost(
      "/about",
      "blockbusterindex.com",
      undefined,
      "foo=bar",
    );
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/about.html?foo=bar",
          },
        ],
      },
    });
  });

  it("always redirects to https even when forwarded proto is http", async () => {
    const event = getEventWithHost("/about", "blockbusterindex.com", "http");
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/about.html",
          },
        ],
      },
    });
  });

  it("redirects case-insensitively for the apex host header", async () => {
    const event = getEventWithHost("/about", "BlockbusterIndex.com");
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/about.html",
          },
        ],
      },
    });
  });

  it("does not redirect for www.blockbusterindex.com", async () => {
    const event = getEventWithHost("/about", "www.blockbusterindex.com");
    const result = await handler(event);
    expect(result).not.toHaveProperty("status", "301");
    expect((result as CloudFrontRequest).uri).toBe("/about.html");
  });

  it("rewrites when headers is undefined", async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              uri: "/about",
              querystring: "",
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;

    const result = await handler(event);
    expect((result as CloudFrontRequest).uri).toBe("/about.html");
  });

  it("redirects with default requestPath when request.uri is undefined", async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              headers: { host: [{ value: "blockbusterindex.com" }] },
              querystring: "",
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/",
          },
        ],
      },
    });
  });

  it("redirects with extension intact when URI already has one", async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              uri: "/robots.txt",
              headers: { host: [{ value: "blockbusterindex.com" }] },
              querystring: "",
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/robots.txt",
          },
        ],
      },
    });
  });

  it("redirects paths that normalize to root without appending .html", async () => {
    const event = getEventWithHost("/foo/..", "blockbusterindex.com");
    const result = await handler(event);
    expect(result).toMatchObject({
      status: "301",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://www.blockbusterindex.com/",
          },
        ],
      },
    });
  });

  it("returns request unchanged for malformed URI on redirect host", async () => {
    const event = getEventWithHost("/%zz", "blockbusterindex.com");
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result).not.toHaveProperty("status", "301");
    expect(result.uri).toBe("/%zz");
  });
});
