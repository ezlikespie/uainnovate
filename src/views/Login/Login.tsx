import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { AuthContext } from '../../shared/AuthProvider';
import StructureNav from '../../shared/StructureNav';
import { validateLogin } from '../../shared/validator';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  // Auth context
  const auth = getAuth();

  // Email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error messages
  const [errors, setErrors] = useState(['']);
  const setErrorsClear = (value: string[]): void => {
    setErrors(value);
    setPassword('');
  };

  interface ClickEvent {
    preventDefault: () => void;
  }

  // State management
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // Sign in function
  const signIn = (e: ClickEvent): void => {
    e.preventDefault();
    const localValidation = validateLogin({ email, password });
    if (localValidation.length > 0) {
      setErrorsClear(localValidation);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        login().catch(() => {});
        navigate('/dashboard');
      })
      .catch(() => {
        setErrorsClear(['Invalid email or password']);
      });
  };

  return (
    <StructureNav>
      <div className='relative flex flex-col rounded-2xl border bg-white p-20 shadow-2xl'>
        <div className='bg-secondary absolute left-0 top-0 h-[30px] w-full rounded-tl-xl rounded-tr-xl'></div>
        <h1 className='mx-auto text-center text-xl font-bold'>Login</h1>
        <form className='flex flex-col'>
          <label htmlFor='formLoginEmail' className='mt-2'>
            Email
          </label>
          <input
            type='email'
            name='email'
            id='formLoginEmail'
            autoComplete='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='mt-2 rounded border border-slate-400 bg-white px-4 py-2 text-slate-700 focus:outline-none'
          />
          <label htmlFor='formLoginPassword' className='mt-2'>
            Password
          </label>
          <input
            type='password'
            name='password'
            id='formLoginPassword'
            autoComplete='current-password'
            className='mt-2 rounded border border-slate-400 bg-white px-4 py-2 text-slate-700 focus:outline-none'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className='mt-4 flex justify-center'>
            <a href='#' className='mr-3 text-sm hover:underline'>
              Forgot password
            </a>
            <span className='relative bottom-0.5 cursor-default text-slate-700'>
              &bull;
            </span>
            <a href='/register' className='ml-3 text-sm hover:underline'>
              Sign up
            </a>
          </div>
          <button
            type='submit'
            className='bg-secondary hover:bg-secondaryLight mx-auto mt-4 inline-block w-fit rounded-full px-10 py-2 font-semibold text-white'
            onClick={signIn}>
            Login
          </button>
          <ul
            className={`mt-5 flex flex-col items-center text-center${
              errors.length === 0 || errors[0] === '' ? ' hidden' : ''
            }`}>
            {errors.map((currentError, index) => {
              return (
                <li key={index} className='max-w-[250px]'>
                  • {currentError}
                </li>
              );
            })}
          </ul>
        </form>
      </div>
    </StructureNav>
  );
};

export default Login;
