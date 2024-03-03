import { AuthContext } from './AuthProvider';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RestrictedComponent: React.FC<FCRequireChildren> = (props) => {
  const { isAdmin, loggedIn } = useContext(AuthContext);

  useEffect(() => {}, [isAdmin, loggedIn]);
  if (!isAdmin || !loggedIn) return <Navigate replace to='/login' />;
  return <>{props.children}</>;
};

export default RestrictedComponent;
