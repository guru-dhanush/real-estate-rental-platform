import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const useLoadingProgress = () => {
    const [progress, setProgress] = useState(0);
    const [isRouteChanging, setIsRouteChanging] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const startLoading = () => {
            setIsRouteChanging(true);
            setProgress(0);

            const increment = () => {
                setProgress(prev => {
                    if (prev >= 90) return 90;
                    return prev + 10;
                });
            };

            timer = setInterval(increment, 100);
        };

        const completeLoading = () => {
            setProgress(100);
            setTimeout(() => {
                setIsRouteChanging(false);
                setProgress(0);
            }, 200);
        };

        startLoading();

        return () => {
            clearInterval(timer);
            completeLoading();
        };
    }, [pathname]);

    return { progress, isRouteChanging };
};
