/**
 * SETU – SignedStorageImage
 *
 * Renders a Supabase Storage image using a fresh signed URL (1-hour TTL).
 * Handles both:
 *   - Public-URL format:  .../object/public/<bucket>/<path>
 *   - Signed-URL format:  .../object/sign/<bucket>/<path>?token=...
 *   - Raw storage paths:  <bucket>/<path>  (no https prefix)
 *
 * Falls back to the raw `src` if signed-URL generation fails or the URL
 * doesn't look like a Supabase storage URL.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface SignedStorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /** Signed URL TTL in seconds (default: 3600 = 1 hour) */
  expiresIn?: number;
}

/**
 * Parses a Supabase storage URL into { bucket, path }.
 *
 * Handles the three known formats:
 *   /storage/v1/object/public/<bucket>/<path>
 *   /storage/v1/object/sign/<bucket>/<path>?token=...
 *   <bucket>/<path>  (plain path, no domain)
 */
function parseSupabaseStorageUrl(url: string): { bucket: string; path: string } | null {
  try {
    // Full URL formats
    const publicMatch = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/?]+)\/(.+?)(?:\?|$)/);
    if (publicMatch) {
      return { bucket: publicMatch[1], path: publicMatch[2] };
    }

    // Plain "bucket/path" format (no domain)
    if (!url.startsWith('http') && url.includes('/')) {
      const slashIdx = url.indexOf('/');
      return {
        bucket: url.slice(0, slashIdx),
        path: url.slice(slashIdx + 1),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function SignedStorageImage({
  src,
  expiresIn = 3600,
  alt = '',
  style,
  className,
  ...rest
}: SignedStorageImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErrored(false);

    async function resolve() {
      const parsed = parseSupabaseStorageUrl(src);

      if (!parsed) {
        // Not a recognisable Supabase storage URL — use as-is
        setResolvedSrc(src);
        return;
      }

      const { data, error } = await supabase.storage
        .from(parsed.bucket)
        .createSignedUrl(parsed.path, expiresIn);

      if (!cancelled) {
        if (error || !data?.signedUrl) {
          console.warn('[SignedStorageImage] Could not create signed URL, falling back:', error?.message);
          setResolvedSrc(src); // Fall back to original URL
        } else {
          setResolvedSrc(data.signedUrl);
        }
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [src, expiresIn]);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={style}
      className={className}
      onError={() => {
        if (!errored) {
          setErrored(true);
          // If the signed URL fails, try the original src as last resort
          if (resolvedSrc !== src) setResolvedSrc(src);
        }
      }}
      {...rest}
    />
  );
}
