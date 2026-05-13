import { PLUGIN_ID } from '../../../pluginId';

export type BrowserInfo = {
  userAgent?: string;
  language?: string;
  viewport?: { width: number; height: number };
  consoleErrors?: string[];
};

const LOCALAZY_HEADER = { 'X-Localazy-Initiated-By': 'strapi-plugin-localazy' };

// Inferred filename when the server didn't send a Content-Disposition we could parse.
const fallbackFilename = (sessionId: string) =>
  `localazy-debug-bundle-${sessionId.slice(0, 8)}-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;

const parseFilenameFromContentDisposition = (header: string | null): string | null => {
  if (!header) return null;
  const match = /filename="?([^";]+)"?/i.exec(header);
  return match ? match[1] : null;
};

const triggerBrowserDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revocation to give the browser time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
};

export const downloadDebugBundle = async (
  sessionId: string,
  token: string | null,
  browserInfo: BrowserInfo
): Promise<void> => {
  const backendURL: string = (window as any).strapi?.backendURL ?? '';
  const encodedBrowser = btoa(unescape(encodeURIComponent(JSON.stringify(browserInfo))));
  const url = `${backendURL}/${PLUGIN_ID}/activity-logs/${encodeURIComponent(sessionId)}/bundle?browser=${encodeURIComponent(encodedBrowser)}`;

  const headers: Record<string, string> = { ...LOCALAZY_HEADER };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { method: 'GET', headers });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const text = await response.text();
      if (text) detail = `${detail} — ${text.slice(0, 200)}`;
    } catch {
      // swallow — keep the status-text detail
    }
    throw new Error(`Failed to download debug bundle: ${detail}`);
  }

  const blob = await response.blob();
  const filename =
    parseFilenameFromContentDisposition(response.headers.get('content-disposition')) ?? fallbackFilename(sessionId);
  triggerBrowserDownload(blob, filename);
};
