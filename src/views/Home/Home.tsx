import './Home.scss';

import StructureNav from '../../shared/StructureNav';

const Home: React.FC = () => {
  return (
    <StructureNav>
      <div className='customGradient flex w-full grow items-center justify-center'>
        <div className='flex w-full max-w-[1000px] flex-col items-center justify-center rounded-xl bg-white py-32 shadow-2xl'>
          <h1 className='text-primarytext text-6xl font-bold'>CGI HR Demo</h1>
          <div className='mt-6 flex'>
            <a
              className='bg-secondary hover:bg-secondaryLight rounded-full px-6 py-3 text-lg font-bold text-white'
              href='/dashboard'>
              HR Portal
            </a>
            <a
              className='bg-secondary hover:bg-secondaryLight ml-2 rounded-full px-6 py-3 text-lg font-bold text-white'
              href='/self-register'>
              Student Signup
            </a>
          </div>
        </div>
      </div>
    </StructureNav>
  );
};

export default Home;
