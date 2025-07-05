"use client";

import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, updateUserAttributes, fetchAuthSession } from "aws-amplify/auth";

// https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const components = {
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-6">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-[#004B93] hover:text-[#004B93] hover:underline bg-transparent border-none p-0 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
            className="!mt-4"
          >
            <Radio value="tenant" className="!text-gray-700">Tenant</Radio>
            <Radio value="manager" className="!text-gray-700">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-[#004B93] hover:text-[#004B93] hover:underline bg-transparent border-none p-0 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

// Shared styles component
const AuthStyles = () => (
  <style jsx global>{`
    /* Custom styles to match HeroSection design */
    .auth-container .amplify-authenticator {
      --amplify-colors-background-primary: transparent;
      --amplify-colors-background-secondary: white;
      --amplify-colors-border-primary: rgb(229, 231, 235);
      --amplify-colors-border-focus: #004B93;
      --amplify-colors-brand-primary-80: #004B93;
      --amplify-colors-brand-primary-90: rgb(29, 78, 216);
      --amplify-colors-brand-primary-100: rgb(30, 64, 175);
      --amplify-radii-medium: 0.75rem;
      --amplify-space-medium: 1rem;
      --amplify-space-large: 1.5rem;
      border-radius: 2rem !important;
    }

    .auth-container .amplify-card {
      background: white;
      border-radius: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgb(229, 231, 235);
      padding: 3rem 2rem;
    }

    .auth-container .amplify-field {
      margin-bottom: 1.5rem;
    }

    .auth-container .amplify-input,
    .auth-container .amplify-select {
      border-radius: 1rem;
      border: 1px solid rgb(209, 213, 219);
      padding: 1rem;
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
    }

    .auth-container .amplify-input:focus,
    .auth-container .amplify-select:focus {
      border-color: #004B93;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      outline: none;
    }

    .auth-container .amplify-button--primary {
      background-color: #004B93;
      border-radius: 1rem;
      padding: 1rem 2rem;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
      border: none;
      width: 100%;
      margin-top: 1rem;
    }

    .auth-container .amplify-button--primary:hover {
      background-color: #003875;
      transform: translateY(-1px);
    }

    .auth-container .amplify-button--link {
      color: #004B93;
      font-weight: 500;
    }

    .auth-container .amplify-button--link:hover {
      color: rgb(29, 78, 216);
      text-decoration: underline;
    }

    .auth-container .amplify-label {
      color: rgb(55, 65, 81);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .auth-container .amplify-text {
      color: rgb(107, 114, 128);
    }

    .auth-container .amplify-radio {
      margin-right: 0.75rem;
    }

    .auth-container .amplify-radio__button {
      border-color: rgb(209, 213, 219);
    }

    .auth-container .amplify-radio__button:checked {
      background-color: #004B93;
      border-color: #004B93;
    }

    .auth-container .amplify-fieldset {
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 1rem;
      background-color: rgb(249, 250, 251);
    }

    .auth-container .amplify-legend {
      color: rgb(55, 65, 81);
      font-weight: 500;
      padding: 0 0.5rem;
    }

    /* Error states */
    .auth-container .amplify-field--error .amplify-input {
      border-color: rgb(239, 68, 68);
    }

    .auth-container .amplify-field__error-message {
      color: rgb(239, 68, 68);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    /* Loading states */
    .auth-container .amplify-loader {
      border-color: #004B93;
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .auth-container .amplify-card {
        padding: 2rem 1.5rem;
        margin: 1rem;
      }
    }
  `}</style>
);

// Shared background component
const AuthBackground = () => (
  <div className="absolute inset-0 z-0">
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-5">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(37, 99, 235)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    {/* Hero background image */}
    <img
      src="/images/herosection/herosection_bg.png"
      alt="Hero background"
      className="absolute bottom-0 left-[-10px] h-[25vh] md:h-[60vh] lg:h-[80vh] w-auto object-cover opacity-90 pointer-events-none select-none"
    />
    {/* Subtle gradient circles */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-20"></div>
  </div>
);

// Shared auth UI component
const AuthUI = ({
  children,
  initialState,
  welcomeMessage
}: {
  children: React.ReactNode;
  initialState: "signIn" | "signUp";
  welcomeMessage: string;
}) => {
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    setAuthLoaded(false);
    const timer = setTimeout(() => setAuthLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white">
      <AuthBackground />

      {/* Centered Auth Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {/* Website Name and Welcome Message */}
        <div className="mb-8 text-center">
          <Link href='/' className="flex text-center justify-center text-3xl font-bold text-[#004B93]">
            Dwelt <span className="text-[#c9002b]">in</span>
          </Link>
          <p className="text-lg text-gray-700 mt-2 font-medium">{welcomeMessage}</p>
        </div>

        {/* Loading spinner */}
        {!authLoaded ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B93]"></div>
          </div>
        ) : (
          <Authenticator
            initialState={initialState}
            components={components}
            formFields={formFields}
            className="auth-container"
          >
            {() => <>{children}</>}
          </Authenticator>
        )}
      </div>

      <AuthStyles />
    </div>
  );
};

const LAST_ATTEMPTED_PATH_KEY = "last_attempted_dashboard_path";

export const switchUserRole = async (newRole: string) => {
  try {
    const user = await getCurrentUser();
    await updateUserAttributes({
      userAttributes: {
        'custom:role': newRole
      }
    });
    
    // Force refresh tokens to get the updated attributes
    await fetchAuthSession();
    
    // Redirect based on new role
    window.location.href = newRole === 'manager' 
      ? '/managers/properties' 
      : '/tenants/favorites';
  } catch (error) {
    console.error('Error switching role:', error);
    throw error;
  }
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(false);

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  // Store last attempted dashboard page if not authenticated
  useEffect(() => {
    if (!isAuthPage && !user) {
      localStorage.setItem(LAST_ATTEMPTED_PATH_KEY, pathname);
    }
  }, [isDashboardPage, user, pathname]);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      setRedirecting(true);
      const lastPath = localStorage.getItem(LAST_ATTEMPTED_PATH_KEY);
      if (lastPath) {
        localStorage.removeItem(LAST_ATTEMPTED_PATH_KEY);
        router.replace(lastPath);
      } else {
        router.replace("/");
      }
    }
  }, [user, isAuthPage, router]);

  // Reset redirecting state after navigation
  useEffect(() => {
    setRedirecting(false);
  }, [pathname]);

  // Prevent rendering children while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white">
        <AuthBackground />
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto">
          {/* Website Name and Welcome Message */}
          <div className="mb-8 text-center">
            <Link href='/' className="flex text-center justify-center text-3xl font-bold text-[#004B93]">
              Dwelt <span className="text-[#c9002b]">in</span>
            </Link>
            <p className="text-lg text-gray-700 mt-2 font-medium">Authenticating...</p>
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B93]"></div>
            </div>
          </div>
        </div>
      </div>

    );
  }

  // If on dashboard page and not authenticated, show Auth UI
  if (isDashboardPage && !user) {
    return (
      <AuthUI
        initialState="signIn"
        welcomeMessage="Sign in to access your dashboard"
      >
        {children}
      </AuthUI>
    );
  }

  // Only show Auth UI for /signin and /signup pages
  if (isAuthPage) {
    return (
      <AuthUI
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        welcomeMessage="Welcome back to premium real estate platform"
      >
        {children}
      </AuthUI>
    );
  }

  // For all other pages, render children only
  return <>{children}</>;
};

export default Auth;