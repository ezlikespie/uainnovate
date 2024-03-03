import { getApp } from 'firebase/app';
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';

import { validateCreateCandidate } from '../../shared/validator';
import CandidateSearch from './CandidateSearch';
import { ScreenContext } from './HRDashboard';
import { useContext, useState } from 'react';

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

const CreateCandidate: React.FC = () => {
  const { switchScreen } = useContext(ScreenContext);
  const [errors, setErrors] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [gradDate, setGradDate] = useState('');
  const [role, setRole] = useState('');
  const [school, setSchool] = useState('');
  const [initialEvent, setInitialEvent] = useState('');

  const screenSwitchHandler = (): void => {
    switchScreen(<CandidateSearch />);
  };

  const handleCreateCandidate = async (): Promise<void> => {
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
    <div className='flex w-full max-w-[1280px] grow flex-col py-16'>
      <h2 className='text-4xl font-bold'>Create Candidate</h2>
      <div className='mt-4 flex'>
        <div
          onClick={screenSwitchHandler}
          className='bg-secondary hover:bg-secondaryLight w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
          Return to List
        </div>
        <div
          onClick={() => {
            handleCreateCandidate().catch(() => {});
          }}
          className='bg-secondary hover:bg-secondaryLight ml-2 w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
          Create Candidate
        </div>
      </div>
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
          Last name:<span className='ml-1 text-sm font-normal'>(required)</span>
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
    </div>
  );
};

export default CreateCandidate;
