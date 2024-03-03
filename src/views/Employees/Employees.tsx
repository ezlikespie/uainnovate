import { getApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
} from 'firebase/firestore';

import StructureNav from '../../shared/StructureNav';

const Employees: React.FC = () => {
  const handleFiring = async (): Promise<void> => {
    const db = getFirestore(getApp());
    const collectionRef = collection(db, 'candidates');
    const collectionQuery = query(collectionRef);
    const collectionDocs = await getDocs(collectionQuery);
    collectionDocs.docs.map(async (item): Promise<void> => {
      await deleteDoc(item.ref);
    });
    alert('The candidates have been successfully eliminated.');
  };

  return (
    <StructureNav>
      <div className='flex w-full max-w-[1280px] grow flex-col py-16'>
        <h2 className='text-4xl font-bold'>Manager Commands</h2>
        <div
          onClick={() => {
            handleFiring().catch(() => {});
          }}
          className='text-bold mt-4 w-fit cursor-pointer select-none rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400'>
          Fire all candidates (they are all terrible)
        </div>
      </div>
    </StructureNav>
  );
};

export default Employees;
