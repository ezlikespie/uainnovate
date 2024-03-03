import { getApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';

import StructureNav from '../../shared/StructureNav';
import { validateCreateCandidate } from '../../shared/validator';
import CandidateSearch from './CandidateSearch';
import { ScreenContext } from './HRDashboard';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NewCandidateCredential {
  firstName: string;
  lastName: string;
  phone: string;
  linkedin: string;
  officeLocation: string;
  gradDate: string;
  role: string;
  school: string;
  initialEvent: string;
}

const generatePassword = (): string => {
  let pass = '';
  const str =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i <= 8; i++) {
    const char = Math.floor(Math.random() * str.length + 1);
    pass += str.charAt(char);
  }

  return pass;
};

const CandidateSelfRegister: React.FC = () => {
  const { switchScreen } = useContext(ScreenContext);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [gradDate, setGradDate] = useState('');
  const [role, setRole] = useState('');
  const [school, setSchool] = useState('');
  const [initialEvent, setInitialEvent] = useState('');

  const auth = getAuth();
  const navigate = useNavigate();

  const handleCreateCandidate = async (): Promise<void> => {
    const tempPassword = generatePassword();
    createUserWithEmailAndPassword(auth, email, tempPassword)
      .then(() => {
        // Registered successfully
        setErrors(['Registration successful']);
        setTimeout(() => {
          navigate('/thank-you');
        }, 1000);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use')
          setErrors(['This user already exists. Try logging in instead']);
        else {
          setErrors(['There was an error signing up']);
        }
      });
    const tempData = {
      firstName,
      lastName,
      phone,
      linkedin,
      officeLocation,
      gradDate,
      role,
      school,
      initialEvent,
    };
    const tempErrors = validateCreateCandidate(tempData);
    if (tempErrors.length > 0) {
      setErrors(tempErrors);
    } else {
      try {
        switchScreen(<CandidateSearch />);
        const db = getFirestore(getApp());
        const collectionRef = collection(db, 'candidates');
        await addDoc(collectionRef, {
          first_name: firstName,
          last_name: lastName,
          phone,
          linkedin,
          office_location: officeLocation,
          grad_date: gradDate,
          date_created: Timestamp.now(),
          job_role: role,
          school,
          initial_event: initialEvent,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <StructureNav>
      <div className='flex w-full max-w-[1280px] grow flex-col py-16'>
        <h2 className='text-4xl font-bold'>Submit information</h2>
        <div
          className={`mt-4 flex flex-col${errors.length === 0 ? ' hidden' : ''}`}>
          {errors.map((item, index) => {
            return (
              <div key={index} className={`${index === 0 ? '' : 'mt-2'}`}>
                - {item}
              </div>
            );
          })}
        </div>
        <div className='mt-4'>
          <div className='text-lg font-bold'>
            Email:
            <span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='Email'
            type='text'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='text-lg font-bold'>
            First name:
            <span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='First name'
            type='text'
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>
            Last name:
            <span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='Last name'
            type='text'
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>
            Role:<span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='Role'
            type='text'
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>
            School:
            <span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='School'
            type='text'
            value={school}
            onChange={(e) => {
              setSchool(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>
            Initial Event:
            <span className='ml-1 text-sm font-normal'>(required)</span>
          </div>
          <input
            placeholder='Initial event'
            type='text'
            value={initialEvent}
            onChange={(e) => {
              setInitialEvent(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>Phone number:</div>
          <input
            placeholder='Phone number'
            type='text'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>Linkedin (URL):</div>
          <input
            placeholder='Linkedin'
            type='text'
            value={linkedin}
            onChange={(e) => {
              setLinkedin(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>Office Location:</div>
          <input
            placeholder='Office location'
            type='text'
            value={officeLocation}
            onChange={(e) => {
              setOfficeLocation(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
          <div className='mt-2 text-lg font-bold'>Graduation Date:</div>
          <input
            placeholder='Graduation date'
            type='text'
            value={gradDate}
            onChange={(e) => {
              setGradDate(e.target.value);
            }}
            className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
          />
        </div>
        <div className='mt-4 flex'>
          <div
            onClick={() => {
              handleCreateCandidate().catch(() => {});
            }}
            className='bg-secondary hover:bg-secondaryLight w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
            Submit
          </div>
        </div>
      </div>
    </StructureNav>
  );
};

export default CandidateSelfRegister;
