import React, { createContext, useState } from "react";

interface ChangeTrackingContextValue {
  initialValue: any;
  value: any;
  onChange: (newValue: Partial<any>) => void;
  propertiesChanged: Set<any>;
}

const defaultValue: ChangeTrackingContextValue = {
  initialValue: {},
  value: {},
  onChange: (newValue: Partial<any>) => {},
  propertiesChanged: new Set(),
};

export const ChangeTrackingContext = createContext(defaultValue);

export function ChangeTrackingProvider({ children, initialValue }: { children: React.ReactNode; initialValue?: any }) {
  return (
    <ChangeTrackingContext.Provider
      value={{
        initialValue,
        value: null,
        propertiesChanged: new Set(),
        onChange: (newValue: Partial<any>) => {},
      }}
    >
      {children}
    </ChangeTrackingContext.Provider>
  );
}
