import { useState, useEffect } from 'react';
import { imageService } from '@/api/imageService.ts';

export const useSecureImage = (src: string) => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!src || src.startsWith('blob:') || src.startsWith('data:')) {
            setLoading(false);
            return;
        }
    }, [src]);

    useEffect(() => {
        let objectUrl = '';
        let isMounted = true;

        const loadImage = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = await imageService.fetchImageBlob(src);
                if (isMounted) {
                    objectUrl = url;
                    setImageSrc(url);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error('Failed to load protected image:', err);
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (src) {
            loadImage();
        } else {
            setLoading(false);
        }

        // Clean up temporary object URL when unmounting or when src changes
        return () => {
            isMounted = false;
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    return { imageSrc, loading, error };
};