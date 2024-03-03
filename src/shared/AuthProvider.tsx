import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from 'react';

interface AuthContextType {
  loggedIn: boolean;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  login: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isAdmin: false,
  setIsAdmin: () => {},
  login: async () => {},
  logout: () => {},
});

const AuthProvider: React.FC<FCChildren> = (props) => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('loggedIn') === 'true',
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const login = async (): Promise<void> => {
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
    try {
      const user = getAuth().currentUser;
      if (user === null) throw Error('User not found');
      const db = getFirestore(getApp());
      const userDataCollection = collection(db, 'userData');
      const userDataQuery = query(
        userDataCollection,
        where('userId', '==', user.uid),
      );
      const userDataSnapshot = await getDocs(userDataQuery);
      if (userDataSnapshot.docs[0].get('role') === 'HR-Admin') setIsAdmin(true);
      else setIsAdmin(false);
    } catch (e) {
      console.log(e);
    }
  };
  const logout = (): void => {
    localStorage.setItem('loggedIn', 'false');
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, login, logout, isAdmin, setIsAdmin }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
