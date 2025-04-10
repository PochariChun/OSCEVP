export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new Response(
    Uint8Array.from(atob('...base64 encoded PNG...'), c => c.charCodeAt(0)),
    {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
} 