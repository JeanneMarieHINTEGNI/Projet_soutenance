import { create } from 'zustand';
import { ReactNode } from 'react';
import React from 'react';

interface CountryStore {
  country: string;
  setCountry: (country: string) => void;
}

export const useCountry = create<CountryStore>((set) => ({
  country: 'benin',
  setCountry: (country: string) => set({ country }),
}));

interface CountryProviderProps {
  children: ReactNode;
  defaultCountry?: string;
}

export const CountryProvider = ({ children, defaultCountry = 'benin' }: CountryProviderProps) => {
  const { setCountry } = useCountry();
  
  // Set the default country when the provider mounts
  React.useEffect(() => {
    setCountry(defaultCountry);
  }, [defaultCountry, setCountry]);

  return <>{children}</>;
};
