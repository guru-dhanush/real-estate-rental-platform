// "use client";

// import { CustomFormField } from "@/components/FormField";
// import Button from "@/components/ui/button/Button";
// import { Modal } from "@/components/ui/modal";
// import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
// import {
//   useCreateApplicationMutation,
//   useGetAuthUserQuery,
//   useGetMangerQuery,
// } from "@/state/api";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React from "react";
// import { useForm } from "react-hook-form";
// import Image from "next/image";
// import { User } from "lucide-react";
// import { Form } from "@/components/ui/form/form";

// const ContactModal = ({
//   isOpen,
//   onClose,
//   propertyId,
//   managerCognitoId,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   propertyId: number;
//   managerCognitoId: string;
// }) => {
//   const [createApplication] = useCreateApplicationMutation();
//   const { data: authUser } = useGetAuthUserQuery();

//   const form = useForm<ApplicationFormData>({
//     resolver: zodResolver(applicationSchema),
//     defaultValues: {
//       name: authUser?.userInfo?.name || "",
//       email: authUser?.userInfo?.email || "",
//       phoneNumber: authUser?.userInfo?.phoneNumber || "",
//       message: "",
//     },
//   });

//   const onSubmit = async (data: ApplicationFormData) => {
//     if (!authUser || authUser.userRole !== "tenant") {
//       console.error("You must be logged in as a tenant to contact the owner");
//       return;
//     }

//     await createApplication({
//       ...data,
//       applicationDate: new Date().toISOString(),
//       status: "Pending",
//       propertyId: propertyId,
//       tenantCognitoId: authUser.cognitoInfo.userId,
//     });
//     onClose();
//   };

//   const {
//     data: manager,
//   } = useGetMangerQuery(managerCognitoId);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
//       <div className="p-6">
//         <div className="flex items-center gap-3 mb-6">
//           {manager?.avatarUrl ? (
//             <Image
//               src={manager?.avatarUrl}
//               alt={manager?.name}
//               width={48}
//               height={48}
//               className="rounded-full object-cover"
//             />
//           ) : (
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white">
//               <User size={24} />
//             </div>
//           )}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Get in touch with {manager?.name}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               What would you like to know about this property?
//             </p>
//           </div>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <CustomFormField
//               name="name"
//               label="Your Name"
//               type="text"
//               placeholder="Enter your full name"
//             />
//             <CustomFormField
//               name="email"
//               label="Email Address"
//               type="email"
//               placeholder="Your email for response"
//             />
//             <CustomFormField
//               name="phoneNumber"
//               label="Phone Number"
//               type="text"
//               placeholder="Preferred contact number"
//             />
//             <CustomFormField
//               name="message"
//               label="Your Message"
//               type="textarea"
//               placeholder="Tell the owner why you're interested..."
//             />

//             <div className="pt-2">
//               <Button
//                 className="bg-primary-600 hover:bg-primary-700 text-white w-full py-3"
//               >
//                 Send Message
//               </Button>
//             </div>

//             <p className="text-xs text-gray-500 text-center dark:text-gray-400">
//               By contacting, you agree to our Privacy Policy. The owner will
//               receive your contact details.
//             </p>
//           </form>
//         </Form>
//       </div>
//     </Modal>
//   );
// };

// export default ContactModal;