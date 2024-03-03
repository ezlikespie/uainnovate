import { AuthContext } from './AuthProvider';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RestrictedComponent: React.FC<FCRequireChildren> = (props) => {
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    console.log('role changed: ' + isAdmin);
  }, [isAdmin]);
  console.log('User rol2e: ' + isAdmin);
  if (!isAdmin) return <Navigate replace to='/login' />;
  return <>{props.children}</>;
};

export default RestrictedComponent;
