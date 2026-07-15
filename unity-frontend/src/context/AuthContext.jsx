import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('unity_token');
    const userId = localStorage.getItem('unity_userId');
    const fullName = localStorage.getItem('unity_fullName');
    const role = localStorage.getItem('unity_role');
    const status = localStorage.getItem('unity_status');
    const buildingId = localStorage.getItem('unity_buildingId');
    const unitId = localStorage.getItem('unity_unitId');

    if (token && role) {
      setUser({
        token,
        userId,
        fullName,
        role,
        status: status || 'PENDING', 
        buildingId,
        unitId
      });
    }
    setLoading(false);
  }, []);

  const login = (authData) => {

    localStorage.setItem('unity_token', authData.token);
    localStorage.setItem('unity_userId', authData.userId);
    localStorage.setItem('unity_fullName', authData.fullName);
    localStorage.setItem('unity_role', authData.role);
    localStorage.setItem('unity_status', authData.status || 'ACTIVE');
    if (authData.buildingId) localStorage.setItem('unity_buildingId', authData.buildingId);
    if (authData.unitId) localStorage.setItem('unity_unitId', authData.unitId);

    setUser({
      token: authData.token,
      userId: authData.userId,
      fullName: authData.fullName,
      role: authData.role,
      status: authData.status || 'ACTIVE',
      buildingId: authData.buildingId,
      unitId: authData.unitId
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);