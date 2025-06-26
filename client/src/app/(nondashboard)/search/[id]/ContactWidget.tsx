// client\src\app\(dashboard)\properties\[id]\components\ContactWidget.tsx
"use client";

import Button from "@/components/ui/button/Button";
import { useGetAuthUserQuery, useGetMangerQuery } from "@/state/api";
import { Phone, Calendar, MessageCircle, Globe, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { useCreateChatMutation } from "@/state/api";

const ContactWidget = ({
  managerCognitoId,
  propertyId,
}: {
  managerCognitoId: string;
  propertyId: number;
}) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const [createChat] = useCreateChatMutation();

  const handleExpressInterest = async () => {
    if (!authUser) {
      router.push("/signin");
      return;
    }

    try {
      // Create a new chat or get existing one
      const chat = await createChat({
        propertyId,
        tenantId: authUser.cognitoInfo.userId,
        managerId: managerCognitoId,
      }).unwrap();

      // Redirect to chat page
      router.push(`/tenants/chat/${chat.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      // Handle error (show toast, etc.)
    }
  };

  const {
    data: manager,
    // isError,
    // isLoading,
  } = useGetMangerQuery(managerCognitoId);

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden sticky top-6">
      {/* Manager Profile Section */}
      <div className="bg-primary-50 p-5 border-b border-primary-100 flex items-center gap-4">
        {manager?.avatarUrl ? (
          <Image
            src={manager?.avatarUrl}
            alt={manager?.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white">
            <User size={24} />
          </div>
        )}
        <div>
          <h3 className="font-medium text-primary-900">Property Manager</h3>
          <p className="text-sm text-primary-700">{manager?.name}</p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="p-5 space-y-4">
        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
            <Phone className="text-primary-700" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            {manager?.phoneNumber ? (
              <p className="text-sm font-medium text-primary-900">
                {manager?.phoneNumber}
              </p>
            ) : (
              <p className="text-xs text-gray-500 italic">Not provided</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
            <MessageCircle className="text-primary-700" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="text-sm font-medium text-primary-900">
              {manager?.email}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm mt-4"
          onClick={handleExpressInterest}
        >
          {authUser ? "Chat with Manager" : "Sign In to Contact"}
        </Button>
      </div>

      {/* Availability */}
      <div className="bg-gray-50 p-5 border-t border-gray-100 space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="text-gray-500 mt-1" size={16} />
          <div>
            <p className="text-sm text-gray-600">Viewing Availability</p>
            <p className="text-xs text-gray-500">By appointment only</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="text-gray-500 mt-1" size={16} />
          <div>
            <p className="text-sm text-gray-600">Response Time</p>
            <p className="text-xs text-gray-500">Usually within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;