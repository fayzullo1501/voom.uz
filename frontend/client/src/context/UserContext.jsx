import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../services/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      setUser(data);

      const carsRes = await axios.get("/api/profile/cars");
      setCars(carsRes.data || []);
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // обновление вручную
  const refreshUser = async () => {
    setLoading(true);
    await loadUser();
  };

  return (
    <UserContext.Provider value={{ user, cars, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);