'use client';

import { Property } from "@/types/prismaTypes";
import dynamic from 'next/dynamic';

// Dynamically import the Card component with SSR disabled
const Card = dynamic(() => import('@/components/Card'), {
    ssr: false,
    loading: () => (
        <div className="w-64 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    ),
});

interface MapCardProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton: boolean;
    propertyLink: string;
}

const MapCard = (props: MapCardProps) => {
    return (
        <Card {...props} className="h-full w-full" />
    );
};

export default MapCard;
