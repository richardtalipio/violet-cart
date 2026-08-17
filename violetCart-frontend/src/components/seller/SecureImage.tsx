import React, { useEffect, useState } from 'react';
import { sellerDashboardService } from '../../api/sellerDashboardService';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

export const SecureImage: React.FC<SecureImageProps> = ({ src, alt, ...props }) => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let objectUrl = '';
        let isMounted = true;

        const loadImage = async () => {
            setLoading(true);
            try {
                const url = await sellerDashboardService.fetchImageBlob(src);
                if (isMounted) {
                    objectUrl = url;
                    setImageSrc(url);
                }
            } catch (error) {
                console.error('Failed to load protected image:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (src) {
            loadImage();
        }

        // Clean up temporary object URL when component unmounts or src changes
        return () => {
            isMounted = false;
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    if (loading) {
        return (
            <div className="w-full h-full bg-black/5 animate-pulse flex items-center justify-center">
                <span className="text-[10px] text-gray-400">Loading...</span>
            </div>
        );
    }

    return <img src={imageSrc} alt={alt} {...props} />;
};