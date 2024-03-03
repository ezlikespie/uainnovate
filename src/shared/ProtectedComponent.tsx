import { AuthContext } from './AuthProvider';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedComponent: React.FC<FCRequireChildren> = (props) => {
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {}, [loggedIn]);
  if (!loggedIn) return <Navigate replace to='/login' />;
  return <>{props.children}</>;
};

export default ProtectedComponent;
