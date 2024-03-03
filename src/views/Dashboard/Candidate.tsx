import { getApp } from 'firebase/app';
import {
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  type Timestamp,
} from 'firebase/firestore';

import CandidateSearch from './CandidateSearch';
import { ScreenContext } from './HRDashboard';
import { useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CandidateData {
  id: string;
  first_name: string;
  last_name: string;
  job_role: string;
  school: string;
  phone?: string;
  linkedin?: string;
  initial_event: string;
  interest_level: string;
  interview_progress: string;
  office_location?: string;
  grad_date?: string;
  date_created: Timestamp;
}
interface CandidatePageType {
  data: CandidateData;
}

const CandidatePage: React.FC<CandidatePageType> = (props) => {
  const { switchScreen } = useContext(ScreenContext);

  const screenSwitchHandler = (): void => {
    switchScreen(<CandidateSearch />);
  };

  const [firstName, setFirstName] = useState(props.data.first_name ?? '');
  const [lastName, setLastName] = useState(props.data.last_name ?? '');
  const [phone, setPhone] = useState(props.data.phone ?? '');
  const [interviewProgress, setInterviewProgress] = useState(
    props.data.interview_progress ?? '',
  );
  const [interestLevel, setInterestLevel] = useState(
    props.data.interest_level ?? '',
  );
  const [linkedin, setLinkedin] = useState(props.data.linkedin ?? '');
  const [officeLocation, setOfficeLocation] = useState(
    props.data.office_location ?? '',
  );
  const [gradDate, setGradDate] = useState(props.data.grad_date ?? '');
  const [role, setRole] = useState(props.data.job_role ?? '');
  const [school, setSchool] = useState(props.data.school ?? '');
  const [initialEvent, setInitialEvent] = useState(
    props.data.initial_event ?? '',
  );
  const [editToggle, setEditToggle] = useState(false);

  const [firstNameOld, setFirstNameOld] = useState(props.data.first_name ?? '');
  const [lastNameOld, setLastNameOld] = useState(props.data.last_name ?? '');
  const [phoneOld, setPhoneOld] = useState(props.data.phone ?? '');
  const [interviewProgressOld, setInterviewProgressOld] = useState(
    props.data.interview_progress ?? '',
  );
  const [interestLevelOld, setInterestLevelOld] = useState(
    props.data.interest_level ?? '',
  );
  const [linkedinOld, setLinkedinOld] = useState(props.data.linkedin ?? '');
  const [officeLocationOld, setOfficeLocationOld] = useState(
    props.data.office_location ?? '',
  );
  const [gradDateOld, setGradDateOld] = useState(props.data.grad_date ?? '');
  const [roleOld, setRoleOld] = useState(props.data.job_role ?? '');
  const [schoolOld, setSchoolOld] = useState(props.data.school ?? '');
  const [initialEventOld, setInitialEventOld] = useState(
    props.data.initial_event ?? '',
  );
  const handleDelete = async (): Promise<void> => {
    switchScreen(<CandidateSearch />);
    const db = getFirestore(getApp());
    await deleteDoc(doc(db, 'candidates', props.data.id));
  };

  const updateData = async (newData: {
    [key in string]: string;
  }): Promise<void> => {
    const db = getFirestore(getApp());
    const docRef = doc(db, 'candidates', props.data.id);
    await setDoc(docRef, newData, { merge: true });
  };

  const handleEdit = (): void => {
    if (editToggle) {
      setFirstName(firstNameOld);
      setLastName(lastNameOld);
      setPhone(phoneOld);
      setInterestLevel(interestLevelOld);
      setInterviewProgress(interviewProgressOld);
      setLinkedin(linkedinOld);
      setOfficeLocation(officeLocationOld);
      setGradDate(gradDateOld);
      setRole(roleOld);
      setSchool(schoolOld);
      setInitialEvent(initialEventOld);
    }
    setEditToggle(!editToggle);
  };

  const handleSave = (): void => {
    setFirstNameOld(firstName);
    setLastNameOld(lastName);
    setPhoneOld(phone);
    setInterviewProgressOld(interviewProgress);
    setInterestLevelOld(interestLevel);
    setLinkedinOld(linkedin);
    setOfficeLocationOld(officeLocation);
    setGradDateOld(gradDate);
    setRoleOld(role);
    setSchoolOld(school);
    setInitialEventOld(initialEvent);
    setEditToggle(false);
    updateData({
      first_name: firstName,
      last_name: lastName,
      phone,
      linkedin,
      office_location: officeLocation,
      grad_date: gradDate,
      job_role: role,
      school,
      initial_event: initialEvent,
    }).catch(() => {});
  };

  return (
    <div className='flex w-full max-w-[1280px] grow flex-col py-16'>
      <h2 className='text-4xl font-bold'>
        View Candidate:{' '}
        <span className='font-normal'>
          {props.data.first_name + ' ' + props.data.last_name}
        </span>
      </h2>
      <div className='mt-4 flex'>
        <div
          onClick={screenSwitchHandler}
          className='bg-secondary hover:bg-secondaryLight w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
          Return to List
        </div>
        <div
          onClick={handleEdit}
          className='bg-secondary hover:bg-secondaryLight ml-2 w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
          {editToggle ? 'Cancel' : 'Edit'}
        </div>
        <div
          onClick={handleSave}
          className={twMerge(
            'bg-secondary hover:bg-secondaryLight ml-2 w-fit cursor-pointer select-none rounded px-4 py-2 font-bold text-white',
            editToggle ? '' : 'hidden',
          )}>
          Save
        </div>
        <div
          onClick={() => {
            handleDelete().catch(() => {});
          }}
          className='ml-2 w-fit cursor-pointer select-none rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-400'>
          Delete
        </div>
      </div>
      <div className='mt-4'>
        <div className='text-lg font-bold'>
          First name:
          <span className='ml-1 text-sm font-normal'>(required)</span>
        </div>
        <input
          placeholder='First name'
          type='text'
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
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
          disabled={!editToggle}
          value={gradDate}
          onChange={(e) => {
            setGradDate(e.target.value);
          }}
          className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
        />
        <div className='mt-2 text-lg font-bold'>Interview Progress:</div>
        <input
          placeholder='Interview progress'
          type='text'
          disabled={!editToggle}
          value={interviewProgress}
          onChange={(e) => {
            setInterviewProgress(e.target.value);
          }}
          className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
        />
        <div className='mt-2 text-lg font-bold'>Interest Level:</div>
        <input
          placeholder='Interest level'
          type='text'
          disabled={!editToggle}
          value={interestLevel}
          onChange={(e) => {
            setInterviewProgress(e.target.value);
          }}
          className='border-primarytext mt-2 w-full max-w-[400px] select-none rounded border px-4 py-2 placeholder:text-slate-700'
        />
      </div>
    </div>
  );
};

export default CandidatePage;
