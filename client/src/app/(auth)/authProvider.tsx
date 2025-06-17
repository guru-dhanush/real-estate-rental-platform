"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";

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

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  // Allow access to public pages without authentication
  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">


      {/* Auth container */}
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
        className="auth-container"
      >
        {() => <>{children}</>}
      </Authenticator>
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
          border-color:[#004B93];
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
          background-color: [#004B93];
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
    </div>
  );
};

export default Auth;