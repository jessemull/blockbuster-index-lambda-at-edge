import { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda";

/**
 * Normalize a URL path: decode, collapse repeated slashes, resolve `.` / `..`,
 * strip trailing slashes, and lowercase. Returns null if decoding fails.
 */
const normalizeUri = (uri: string): string | null => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(uri);
  } catch {
    return null;
  }

  const segments = decoded.split("/");
  const resolved: string[] = [];

  for (const segment of segments) {
    if (segment === "" || segment === ".") {
      continue;
    }
    if (segment === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(segment);
  }

  const normalized = `/${resolved.join("/")}`.replace(/\/+$/, "") || "/";
  return normalized.toLowerCase();
};

export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const headers = request.headers || {};

  // Redirect non-canonical domain to canonical domain (blockbusterindex.com -> www.blockbusterindex.com)...

  const hostHeader = headers["host"]?.[0]?.value?.toLowerCase();
  if (hostHeader === "blockbusterindex.com") {
    const requestPath = request.uri || "/";
    let redirectPath: string;

    if (requestPath === "/") {
      redirectPath = "/";
    } else {
      const normalizedUri = normalizeUri(requestPath);
      if (normalizedUri === null) {
        return request;
      }

      if (normalizedUri === "/") {
        redirectPath = "/";
      } else {
        const hasExtension = /\.[a-zA-Z0-9]+$/.test(normalizedUri);
        redirectPath = hasExtension ? normalizedUri : `${normalizedUri}.html`;
      }
    }

    const querystring = request.querystring ? `?${request.querystring}` : "";

    return {
      status: "301",
      statusDescription: "Moved Permanently",
      headers: {
        location: [
          {
            key: "Location",
            value: `https://www.blockbusterindex.com${redirectPath}${querystring}`,
          },
        ],
      },
    };
  }

  if (request.uri === "/") {
    request.uri = "/index.html";
    return request;
  }

  const normalizedUri = normalizeUri(request.uri);
  if (normalizedUri === null) {
    return request;
  }

  if (normalizedUri === "/") {
    request.uri = "/index.html";
    return request;
  }

  const hasExtension = /\.[a-zA-Z0-9]+$/.test(normalizedUri);

  if (!hasExtension) {
    request.uri = `${normalizedUri}.html`;
  } else {
    request.uri = normalizedUri;
  }

  return request;
};
