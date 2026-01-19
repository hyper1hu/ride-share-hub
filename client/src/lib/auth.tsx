import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

interface Customer {
  id: string;
  mobile: string;
  name: string;
  age: number;
}

interface Driver {
  id: string;
  mobile: string;
  name: string;
  age: number;
  aadhaarNumber: string;
  licenseNumber: string;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

interface AuthContextType {
  customer: Customer | null;
  driver: Driver | null;
  isLoading: boolean;
  isCustomerLoggedIn: boolean;
  isDriverLoggedIn: boolean;
  loginCustomer: (mobile: string) => Promise<{ success: boolean; needsRegistration?: boolean; error?: string }>;
  registerCustomer: (data: { mobile: string; name: string; age: number }) => Promise<{ success: boolean; error?: string }>;
  loginDriver: (mobile: string) => Promise<{ success: boolean; needsRegistration?: boolean; error?: string }>;
  registerDriver: (data: { 
    mobile: string; 
    name: string; 
    age: number; 
    aadhaarNumber: string; 
    licenseNumber: string;
    aadhaarImage?: string;
    licenseImage?: string;
    rcImage?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);

  const { data: customerData, isLoading: customerLoading, refetch: refetchCustomer } = useQuery({
    queryKey: ["/api/auth/customer/me"],
    retry: false,
  });

  const { data: driverData, isLoading: driverLoading, refetch: refetchDriver } = useQuery({
    queryKey: ["/api/auth/driver/me"],
    retry: false,
  });

  useEffect(() => {
    if (customerData?.customer) {
      setCustomer(customerData.customer);
    } else {
      setCustomer(null);
    }
  }, [customerData]);

  useEffect(() => {
    if (driverData?.driver) {
      setDriver(driverData.driver);
    } else {
      setDriver(null);
    }
  }, [driverData]);

  const loginCustomer = async (mobile: string): Promise<{ success: boolean; needsRegistration?: boolean; error?: string }> => {
    try {
      const response = await apiRequest("POST", "/api/auth/customer/login", { mobile });
      const data = await response.json();
      if (response.ok) {
        setCustomer(data.customer);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/customer/me"] });
        return { success: true };
      }
      return { success: false, needsRegistration: data.needsRegistration, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const registerCustomer = async (data: { mobile: string; name: string; age: number }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest("POST", "/api/auth/customer/register", data);
      const result = await response.json();
      if (response.ok) {
        setCustomer(result.customer);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/customer/me"] });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const loginDriver = async (mobile: string): Promise<{ success: boolean; needsRegistration?: boolean; error?: string }> => {
    try {
      const response = await apiRequest("POST", "/api/auth/driver/login", { mobile });
      const data = await response.json();
      if (response.ok) {
        setDriver(data.driver);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/driver/me"] });
        return { success: true };
      }
      return { success: false, needsRegistration: data.needsRegistration, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const registerDriver = async (data: { 
    mobile: string; 
    name: string; 
    age: number; 
    aadhaarNumber: string; 
    licenseNumber: string;
    aadhaarImage?: string;
    licenseImage?: string;
    rcImage?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest("POST", "/api/auth/driver/register", data);
      const result = await response.json();
      if (response.ok) {
        setDriver(result.driver);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/driver/me"] });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setCustomer(null);
      setDriver(null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/customer/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/driver/me"] });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refetch = () => {
    refetchCustomer();
    refetchDriver();
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        driver,
        isLoading: customerLoading || driverLoading,
        isCustomerLoggedIn: !!customer,
        isDriverLoggedIn: !!driver,
        loginCustomer,
        registerCustomer,
        loginDriver,
        registerDriver,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
