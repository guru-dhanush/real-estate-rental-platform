'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, Check, Settings, Shield, Cookie } from 'lucide-react';

interface CookieType {
    id: string;
    label: string;
    description: string;
    required?: boolean;
    checked: boolean;
    disabled?: boolean;
}

interface CookiePreferences {
    [key: string]: boolean;
}

interface CookieConsentState {
    isVisible: boolean;
    showSettings: boolean;
    preferences: CookiePreferences;
}

const COOKIE_TYPES: Record<string, CookieType> = {
    necessary: {
        id: 'necessary',
        label: 'Essential',
        description: 'Required for the site to function. Includes security, login, and basic preferences.',
        required: true,
        checked: true,
        disabled: true,
    },
    preferences: {
        id: 'preferences',
        label: 'Preferences',
        description: 'Remembers your search filters, favorite properties, and display settings.',
        checked: true,
    },
    analytics: {
        id: 'analytics',
        label: 'Analytics',
        description: 'Helps us understand how users interact with our property listings and improve our services.',
        checked: true,
    },
    marketing: {
        id: 'marketing',
        label: 'Marketing',
        description: 'Allows us to show you relevant properties and offers based on your interests.',
        checked: false,
    },
};

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({});

    useEffect(() => {
        const defaultPrefs = Object.entries(COOKIE_TYPES).reduce((acc, [key, value]) => {
            acc[key] = value.checked;
            return acc;
        }, {} as CookiePreferences);
        setPreferences(defaultPrefs);
    }, []);

    const handleAcceptAll = (): void => {
        const allAccepted: CookiePreferences = Object.keys(COOKIE_TYPES).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as CookiePreferences);
        setIsVisible(false);
    };

    const handleSavePreferences = (): void => {
        setIsVisible(false);
    };

    const togglePreference = (key: string) => {
        if (COOKIE_TYPES[key as keyof typeof COOKIE_TYPES]?.required) return;
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (!isVisible) return null;

    const hasCustomSelection = Object.entries(preferences).some(([key, value]) =>
        value !== COOKIE_TYPES[key as keyof typeof COOKIE_TYPES]?.checked
    );

    return (
        <div className="fixed bottom-4 right-4 bg-white shadow-2xl z-50 border border-gray-200 rounded-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            {/* Compact Header */}
            <div className="px-4 py-3">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full flex-shrink-0">
                            <Shield className="h-4 w-4 text-[#004B93]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900">Cookie Preferences</h3>
                            <p className="text-xs text-gray-600">
                                We use cookies to enhance your experience.
                                <a href="/privacy-policy" className="text-[#004B93] hover:underline ml-1">Privacy Policy</a>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-xs text-[#004B93] hover:text-blue-800 flex items-center justify-center px-2 py-1 rounded-md hover:bg-blue-50 transition-colors border border-gray-200"
                    >
                        <Settings className="h-3 w-3 mr-1" />
                        {showSettings ? 'Close Settings' : 'Customize'}
                    </button>

                    <div className="flex space-x-2">
                        {(showSettings || hasCustomSelection) && (
                            <Button
                                onClick={handleSavePreferences}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 px-3 border-gray-300 hover:border-[#004B93] hover:text-[#004B93] flex-1"
                            >
                                <Check className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Accept Selected</span>
                                <span className="sm:hidden">Selected</span>
                            </Button>
                        )}

                        <Button
                            onClick={handleAcceptAll}
                            size="sm"
                            className={`text-xs h-8 px-3 bg-[#004B93] hover:bg-blue-800 text-white ${(showSettings || hasCustomSelection) ? 'flex-1' : 'w-full'}`}
                        >
                            Accept All
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expandable Settings */}
            {showSettings && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="space-y-3">
                        {Object.entries(COOKIE_TYPES).map(([key, cookie]) => (
                            <div key={key} className="flex items-start justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-start space-x-3 min-w-0">
                                    <div className="flex items-center mt-0.5">
                                        <input
                                            id={`cookie-${key}`}
                                            type="checkbox"
                                            checked={preferences[key] ?? false}
                                            onChange={() => togglePreference(key)}
                                            disabled={cookie.required}
                                            className={`h-4 w-4 rounded ${cookie.required
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#004B93] focus:ring-[#004B93] border-gray-300 cursor-pointer'
                                                }`}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`cookie-${key}`}
                                            className={`text-sm font-medium ${cookie.required
                                                ? 'text-gray-900'
                                                : 'text-gray-700 cursor-pointer'
                                                } flex items-center flex-wrap`}
                                        >
                                            {cookie.label}
                                            {cookie.required && (
                                                <span className="ml-2 text-xs bg-[#004B93] text-white px-2 py-0.5 rounded-full">
                                                    Required
                                                </span>
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">{cookie.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-2">
                            <Cookie className="h-4 w-4 text-[#004B93] mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                                <h4 className="text-sm font-medium text-[#004B93] mb-1">Why we use cookies</h4>
                                <p className="text-xs text-gray-600">
                                    Cookies help us remember your preferences, analyze site usage, and show you relevant content.
                                    You can change these settings anytime in your
                                    <a href="/cookie-settings" className="text-[#004B93] hover:underline ml-1">account settings</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}