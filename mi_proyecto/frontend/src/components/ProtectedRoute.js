import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authStore, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authStore.getIsLoggedIn());

  useEffect(() => {
    const handleChange = () => {
      setIsLoggedIn(authStore.getIsLoggedIn());
    };

    authStore.addChangeListener(handleChange);
    return () => {
      authStore.removeChangeListener(handleChange);
    };
  }, []);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
