import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            setUser(null); 
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      } else {
        setUser(JSON.parse(localStorage.getItem("user")) ?? null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
