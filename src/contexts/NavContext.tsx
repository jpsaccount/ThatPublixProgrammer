import { createContext, useEffect, useState } from "react";

export const NavContext = createContext({
  currentPage: { title: "", location: "" },
  currentCallStack: new Map<string, string>(),
  setCurrentPage: (url: string, title: string) => {},
});

function isChildPath(parentPath, childPath): boolean {
  // Ensure both paths end with a trailing slash
  const normalizedParent = parentPath?.endsWith("/") ? parentPath : parentPath + "/";
  const normalizedChild = childPath?.endsWith("/") ? childPath : childPath + "/";

  // Check if the child path starts with the parent path
  return normalizedChild.startsWith(normalizedParent);
}

export function NavContextProvider({ children }) {
  const [currentPage, setCurrentPage] = useState({ title: "", location: "" });
  const [currentCallStack, setCurrentCallStack] = useState<Map<string, string>>(new Map<string, string>());

  useEffect(() => {
    setCurrentCallStack((prev) => {
      const newMap = new Map();

      for (const [location, title] of prev.entries()) {
        if (isChildPath(location, currentPage.location) && location !== "") {
          newMap.set(location, title);
        }
      }

      newMap.set(currentPage.location, currentPage.title);
      return newMap;
    });
  }, [currentPage]);

  return (
    <NavContext.Provider
      value={{
        currentPage,
        currentCallStack,
        setCurrentPage: (title, url) => setCurrentPage({ title, location: url }),
      }}
    >
      {children}
    </NavContext.Provider>
  );
}
