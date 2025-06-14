import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomFormField } from "./FormField";
import ComponentCard from "./common/ComponentCard";
import { Form } from "./ui/form/form";

const SettingsForm = ({
  initialData,
  onSubmit,
  userType,
}: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });
  const toggleEditMode = () => {
    setEditMode(!editMode);

  };


  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  return (
    <ComponentCard title={`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`} desc="Manage your account preferences and personal information" >
      <div className="bg-white rounded-xl">
        <Form {...form}>
          <form
            onSubmit={editMode ? form.handleSubmit(handleSubmit) : (e) => e.preventDefault()}
            className="space-y-6"
          >
            <CustomFormField name="name" label="Name" disabled={!editMode} />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled
            />
            <div className="pt-4 flex justify-between">
              <button
                onClick={toggleEditMode}
                type="button"
                className="bg-secondary-500 text-black hover:bg-secondary-600 px-4 py-2 rounded"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
              {editMode && (
                <button
                  type="submit"
                  className="bg-primary-700 text-black hover:bg-primary-800 px-4 py-2 rounded"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </ComponentCard>
  );
};

export default SettingsForm;
