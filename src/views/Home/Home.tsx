import './Home.scss';

import StructureNav from '../../shared/StructureNav';

const Home: React.FC = () => {
  return (
    <StructureNav>
      <div className='customGradient flex w-full grow items-center justify-center'>
        <div className='flex w-full max-w-[1000px] flex-col items-center justify-center rounded-xl bg-white py-32 shadow-2xl'>
          <h1 className='text-primarytext text-6xl font-bold'>CGI HR Demo</h1>
          <a
            className='bg-secondary hover:bg-secondaryLight mt-6 rounded-full px-8 py-4 text-xl font-bold text-white'
            href='/dashboard'>
            Get Started
          </a>
        </div>
      </div>
    </StructureNav>
  );
};

export default Home;
