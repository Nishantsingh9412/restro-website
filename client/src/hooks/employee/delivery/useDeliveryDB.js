import { useToast } from "../../../contexts/useToast";

export const useDeliveryDashboard = () => {
  const showToast = useToast();

  return { showToast };
};
