'use client';

import { Box } from '@mui/material';

interface BackgroundBlobsProps {
    variant?: 'hero' | 'features' | 'default';
}

const BackgroundBlobs = ({ variant = 'default' }: BackgroundBlobsProps) => {
    return (
        <>
            {variant === 'hero' && (
                <>
                    {/* Top left blob */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 95,
                            left: 95,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(115, 253, 170, 1) 0%, rgba(115, 253, 170, 0.3) 100%)',
                            filter: 'blur(139px)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Center right blob */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 669,
                            left: 1006,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(115, 253, 170, 1) 0%, rgba(115, 253, 170, 1) 100%)',
                            filter: 'blur(139px)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />
                </>
            )}

            {variant === 'features' && (
                <>
                    {/* Left blob */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '0%',
                            width: 248,
                            height: 248,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(115, 253, 170, 1) 0%, rgba(115, 253, 170, 0.5) 100%)',
                            filter: 'blur(139px)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Right blob */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '20%',
                            right: '5%',
                            width: 248,
                            height: 248,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(115, 253, 170, 1) 0%, rgba(115, 253, 170, 0.5) 100%)',
                            filter: 'blur(139px)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />
                </>
            )}

            {variant === 'default' && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 248,
                        height: 248,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(115, 253, 170, 1) 0%, rgba(115, 253, 170, 0.5) 100%)',
                        filter: 'blur(139px)',
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </>
    );
};

export default BackgroundBlobs;
