export type ProfileCompletionProps = {
  formData: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    accountType: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
};
