import Navbar from './Navbar';

const StructureNav: React.FC<FCRequireChildren> = (props) => {
  return (
    <div className='flex min-h-screen w-full flex-col items-center'>
      <Navbar />
      <div className='flex w-full flex-auto grow flex-col items-center justify-center bg-[#efefef]'>
        {props.children}
      </div>
    </div>
  );
};

export default StructureNav;
