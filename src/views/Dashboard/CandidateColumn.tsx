import Candidate, { type CandidateData } from './Candidate';
import { ScreenContext } from './HRDashboard';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

interface CandidateColumnType {
  data: CandidateData[];
  field: string;
}

const CandidateColumn: React.FC<CandidateColumnType> = (props) => {
  const { switchScreen } = useContext(ScreenContext);

  let categoryLabel;
  if (props.field === 'name') {
    categoryLabel = 'Name';
  } else if (props.field === 'job_role') {
    categoryLabel = 'Role';
  } else if (props.field === 'school') {
    categoryLabel = 'School';
  } else if (props.field === 'initial_event') {
    categoryLabel = 'Initial Event';
  }

  return (
    <div className='flex flex-col'>
      <div
        className={`border-primarytext flex h-[50px] flex-col justify-center border-b text-xl font-bold${props.field === 'name' ? '' : ' pl-16'}`}>
        {categoryLabel}
      </div>
      {props.data.map((item, index) => {
        let textValue;
        if (props.field === 'name') {
          if (item.first_name !== undefined && item.last_name !== undefined)
            textValue = item.first_name + ' ' + item.last_name;
        } else if (props.field === 'job_role') {
          textValue = item.job_role;
        } else if (props.field === 'school') {
          textValue = item.school;
        } else if (props.field === 'initial_event') {
          textValue = item.initial_event;
        }

        if (props.field === 'select') {
          return (
            <div
              key={index}
              className='border-primarytext flex h-[50px] flex-col justify-center border-b pl-8'>
              <div
                onClick={() => {
                  switchScreen(<Candidate data={item} />);
                }}
                className='bg-secondary hover:bg-secondaryLight flex h-[35px] cursor-pointer select-none flex-col justify-center rounded px-4 font-bold text-white'>
                View
              </div>
            </div>
          );
        }
        return (
          <div
            key={index}
            className={twMerge(
              'border-primarytext flex h-[50px] flex-col justify-center border-b',
              props.field === 'name' ? '' : 'pl-16',
            )}>
            {textValue}
          </div>
        );
      })}
    </div>
  );
};

export default CandidateColumn;
