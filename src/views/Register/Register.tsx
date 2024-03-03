import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import { AuthContext } from '../../shared/AuthProvider';
import StructureNav from '../../shared/StructureNav';
import { validateRegister } from '../../shared/validator';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  // Firebase auth context
  const auth = getAuth();

  // Navigation
  const navigate = useNavigate();

  // Global state auth context
  const { login } = useContext(AuthContext);

  // Email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  interface ClickEvent {
    preventDefault: () => void;
  }

  // Credential validation
  const [registeredOnce, setRegisteredOnce] = useState(false);
  const updateEmail = (value: string): void => {
    if (registeredOnce) setErrors(validateRegister({ email: value, password }));
    setEmail(value);
  };
  const updatePassword = (value: string): void => {
    if (registeredOnce) setErrors(validateRegister({ email, password: value }));
    setPassword(value);
  };

  // Register function
  const register = (e: ClickEvent): void => {
    e.preventDefault();
    const localValidation = validateRegister({ email, password });
    if (localValidation.length > 0) {
      setRegisteredOnce(true);
      setErrors(localValidation);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Registered successfully
        setErrors(['Registration successful']);
        login().catch(() => {});
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use')
          setErrors(['This user already exists. Try logging in instead']);
        else {
          setErrors(['There was an error signing up']);
        }
      });
  };
  return (
    <StructureNav>
      <div className='relative z-10 flex flex-col rounded-2xl border bg-white p-20 shadow-2xl'>
        <div className='bg-secondary absolute left-0 top-0 h-[30px] w-full rounded-tl-xl rounded-tr-xl'></div>
        <h1 className='mx-auto text-center text-xl font-bold'>Register</h1>
        <form className='flex flex-col'>
          <label htmlFor='formRegisterEmail' className='mt-2'>
            Email
          </label>
          <input
            type='email'
            name='email'
            id='formRegisterEmail'
            autoComplete='email'
            value={email}
            onChange={(e) => {
              updateEmail(e.target.value);
            }}
            className='mt-2 rounded border border-slate-400 bg-white px-4 py-2 text-slate-700 focus:outline-none'
          />
          <label htmlFor='formRegisterPassword' className='mt-2'>
            Password
          </label>
          <input
            type='password'
            name='password'
            id='formRegisterPassword'
            autoComplete='new-password'
            className='mt-2 rounded border border-slate-400 bg-white px-4 py-2 text-slate-700 focus:outline-none'
            value={password}
            onChange={(e) => {
              updatePassword(e.target.value);
            }}
          />
          <div className='mt-4 flex justify-center'>
            <a href='#' className='mr-3 text-sm hover:underline'>
              Forgot password
            </a>
            <span className='relative bottom-0.5 cursor-default text-slate-700'>
              &bull;
            </span>
            <a href='/login' className='ml-3 text-sm hover:underline'>
              Log in
            </a>
          </div>
          <button
            type='submit'
            className='bg-secondary hover:bg-secondaryLight mx-auto mt-4 inline-block w-fit rounded-full px-10 py-2 font-semibold text-white'
            onClick={register}>
            Register
          </button>
        </form>
        <div>
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
        </div>
      </div>
    </StructureNav>
  );
};

export default Register;
