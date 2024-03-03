import StructureNav from '../../shared/StructureNav';

const Employees: React.FC = () => {
  return (
    <StructureNav>
      <div className='flex w-full max-w-[1280px] grow flex-col py-16'>
        <h2 className='text-4xl font-bold'>Manage Employees</h2>
      </div>
    </StructureNav>
  );
};

export default Employees;
