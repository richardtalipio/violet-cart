import React from 'react';
import { useSecureImage } from '@/hooks/useSecureImage.ts';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

export const SecureImage: React.FC<SecureImageProps> = ({ src, alt, ...props }) => {
    const { imageSrc, loading, error } = useSecureImage(src);

    if (loading) {
        return (
            <div className="w-full h-full bg-black/5 animate-pulse flex items-center justify-center">
                <span className="text-[10px] text-gray-400">Loading...</span>
            </div>
        );
    }

    if (error || !imageSrc) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-[10px]">Failed to load image</span>
            </div>
        );
    }

    return <img src={imageSrc} alt={alt} {...props} />;
};