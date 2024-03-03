import StructureNav from '../../shared/StructureNav';

const ThankYou = (): JSX.Element => {
  return (
    <StructureNav>
      <div className='flex w-full max-w-[1280px] grow flex-col items-center justify-center py-16'>
        <div className='flex flex-col items-center'>
          <h1 className='text-6xl font-bold'>Thank You</h1>
          <a
            href='/'
            className='bg-secondary hover:bg-secondaryLight mt-4 cursor-pointer select-none rounded-full px-6 py-3 text-xl font-bold text-white'>
            Return Home
          </a>
        </div>
      </div>
    </StructureNav>
  );
};

export default ThankYou;
