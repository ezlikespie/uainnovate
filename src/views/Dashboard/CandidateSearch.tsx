import { getApp } from 'firebase/app';
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
  endBefore,
  orderBy,
  type QueryOrderByConstraint,
  where,
  type QueryConstraint,
} from 'firebase/firestore';

import { type CandidateData } from './Candidate';
import CandidateColumn from './CandidateColumn';
import CreateCandidate from './CreateCandidate';
import { ScreenContext } from './HRDashboard';
import { useContext, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const MAX_CANDIDATES_SHOWN = 10;
const FILTER_CATEGORIES: { [key in string]: string } = {
  job_role: 'Role',
  school: 'School',
};

type FilterData = {
  [key in string]: string[];
};

const CandidateSearch: React.FC = () => {
  const [currentCandidates, setCurrentCandidates] = useState<CandidateData[]>(
    [],
  );
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [numCandidatesShowing, setNumCandidatesShowing] = useState(0);

  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
  const [firstVisible, setFirstVisible] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();

  const { switchScreen } = useContext(ScreenContext);

  const [filterToggle, setFilterToggle] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>();
  const [filterOptions, setFilterOptions] = useState<FilterData>();
  const [sortToggle, setSortToggle] = useState(false);
  const [sortType, setSortType] = useState('Date created (descending)');

  const getOrderBy = (_sortType?: string): QueryOrderByConstraint => {
    const workingType = _sortType ?? sortType;
    if (workingType === 'Date created (ascending)')
      return orderBy('date_created', 'asc');
    else if (workingType === 'Date created (descending)')
      return orderBy('date_created', 'desc');
    else if (workingType === 'Role (ascending)')
      return orderBy('job_role', 'asc');
    else if (workingType === 'Role (descending)')
      return orderBy('job_role', 'desc');
    else if (workingType === 'Name (ascending)')
      return orderBy('first_name', 'asc');
    else if (workingType === 'Name (descending)')
      return orderBy('first_name', 'desc');
    return orderBy('date_created', 'desc');
  };

  const updateData = async (
    direction?: string,
    _sortType?: string,
    _filterData?: FilterData,
    _searchValue?: string,
  ): Promise<void> => {
    try {
      const db = getFirestore(getApp());
      const candidateCollection = collection(db, 'candidates');
      const candidatesQuery = query(candidateCollection);
      const candidatesSnapshot = await getDocs(candidatesQuery);
      setTotalCandidates(candidatesSnapshot.size);
      let candidatesQueryNarrow;
      const queryList: QueryConstraint[] = [
        getOrderBy(_sortType),
        limit(MAX_CANDIDATES_SHOWN),
      ];
      if (_filterData !== undefined) {
        for (const category of Object.keys(_filterData)) {
          if (_filterData[category].length > 0)
            queryList.push(where(category, '==', _filterData[category][0]));
        }
      }
      const workingSearchValue = _searchValue ?? searchValue;
      if (workingSearchValue !== undefined && workingSearchValue.length >= 2) {
        queryList.push(where('first_name', '==', workingSearchValue));
      }
      if (direction !== undefined) {
        if (direction === 'forward') {
          candidatesQueryNarrow = query(
            candidateCollection,
            startAfter(lastVisible),
            ...queryList,
          );
        } else {
          candidatesQueryNarrow = query(
            candidateCollection,
            endBefore(firstVisible),
            ...queryList,
          );
        }
      } else {
        candidatesQueryNarrow = query(candidateCollection, ...queryList);
      }

      const candidatesSnapshotNarrow = await getDocs(candidatesQueryNarrow);

      const candidatesData = candidatesSnapshotNarrow.docs.map((doc) => ({
        id: doc.id,
        first_name: doc.get('first_name'),
        last_name: doc.get('last_name'),
        job_role: doc.get('job_role'),
        school: doc.get('school'),
        phone: doc.get('phone'),
        linkedin: doc.get('initial_event'),
        initial_event: doc.get('initial_event'),
        office_location: doc.get('office_location'),
        grad_date: doc.get('grad_date'),
        interview_progress: doc.get('interview_progress'),
        interest_level: doc.get('interest_level'),
        date_created: doc.get('date_created'),
      }));
      setCurrentCandidates(candidatesData);
      setNumCandidatesShowing(candidatesSnapshotNarrow.size);
      setFirstVisible(candidatesSnapshotNarrow.docs[0]);
      setLastVisible(
        candidatesSnapshotNarrow.docs[candidatesSnapshotNarrow.docs.length - 1],
      );
    } catch (error) {
      console.error('Error fetching candidates: ', error);
    }
  };

  const initializeFilterOptions = async (): Promise<void> => {
    const db = getFirestore(getApp());
    const candidateCollection = collection(db, 'candidates');
    const candidatesQuery = query(candidateCollection);
    const candidatesSnapshot = await getDocs(candidatesQuery);
    const filters: { [key in string]: string[] } = {};
    const blankFilters: { [key in string]: string[] } = {};
    for (const filterCategory of Object.keys(FILTER_CATEGORIES)) {
      filters[filterCategory] = [];
      blankFilters[filterCategory] = [];
      candidatesSnapshot.docs.map((item) => {
        const value = item.get(filterCategory);
        if (value !== undefined && !filters[filterCategory].includes(value))
          filters[filterCategory].push(value);
        return null;
      });
    }
    setFilterData(blankFilters);
    setFilterOptions(filters);
  };

  const updateFilterData = (category: string, value: string): void => {
    const _filterData: FilterData = {};
    if (filterData === undefined) return;
    Object.assign(_filterData, filterData);
    if (!_filterData[category].includes(value)) {
      _filterData[category].push(value);
    } else {
      _filterData[category].splice(_filterData[category].indexOf(value), 1);
    }
    setFilterData(_filterData);
    updateData(undefined, undefined, _filterData).catch(() => {});
  };

  useEffect(() => {
    updateData(undefined, sortType).catch(() => {});
    initializeFilterOptions().catch(() => {});
  }, []);

  const handleFilterToggle = (): void => {
    if (!filterToggle) {
      setFilterToggle(true);
      setSortToggle(false);
    } else {
      setFilterToggle(false);
    }
  };
  const handleSortToggle = (): void => {
    if (!sortToggle) {
      setSortToggle(true);
      setFilterToggle(false);
    } else {
      setSortToggle(false);
    }
  };
  const handleSortType = (value: string): void => {
    setSortType(value);
    setSortToggle(false);
    updateData(undefined, value).catch(() => {});
  };

  const [filterFocus, setFilterFocus] = useState<string>();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchKeyDown = (e: { key: string }): void => {
    if (e.key === 'Enter') {
      if (searchValue.length >= 2) {
        updateData(undefined, undefined, undefined, searchValue).catch(
          () => {},
        );
      } else {
        setSearchValue('');
        updateData(undefined, undefined, undefined, '').catch(() => {});
      }
    }
  };

  return (
    <div className='mt-16 flex w-full max-w-[1280px] grow flex-col'>
      <h2 className='text-4xl font-bold'>Current Candidates</h2>
      <div className='mt-4 flex'>
        <input
          type='text'
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          placeholder='Search'
          onKeyDown={handleSearchKeyDown}
          className='border-primarytext text-primarytext w-[300px] select-none rounded border bg-[#f7f7f7] py-1 pl-4 placeholder:text-slate-700'
        />
        <div className='relative flex'>
          <div
            onClick={handleFilterToggle}
            className='border-primarytext text-primarytext relative ml-2 flex min-w-[100px] cursor-pointer select-none items-center rounded border bg-[#f7f7f7] py-1 pl-4 hover:bg-slate-500 hover:text-white'>
            Filter
            <img
              className='ml-1 aspect-square h-[20px]'
              src='/icons/dark_arrow_down.svg'
              alt='Down arrow'
            />
          </div>
          <div
            className={`absolute left-2 text-nowrap rounded-lg bg-slate-700 p-4 text-white top-[50px]${filterToggle ? '' : ' hidden'}`}>
            {(() => {
              if (filterOptions === undefined) return null;
              return Object.keys(filterOptions).map(
                (category, categoryIndex) => {
                  return (
                    <div
                      key={categoryIndex}
                      className={categoryIndex === 0 ? '' : 'mt-2'}>
                      <div className='capitalize'>
                        {FILTER_CATEGORIES[category]}:
                      </div>
                      <div className='mt-1 flex flex-col'>
                        <div
                          onClick={() => {
                            if (filterFocus === category) setFilterFocus('');
                            else setFilterFocus(category);
                          }}
                          className={twMerge(
                            'text-primarytext flex cursor-pointer select-none items-center rounded-tl rounded-tr bg-white px-4 py-2',
                            filterFocus === category &&
                              filterOptions[category] !== undefined &&
                              filterOptions[category].length > 0
                              ? ''
                              : ' rounded-bl rounded-br',
                            filterFocus === category
                              ? 'border-b border-slate-700'
                              : '',
                          )}>
                          Select {FILTER_CATEGORIES[category]}
                          <img
                            className='ml-1 mr-4 inline aspect-square h-[20px]'
                            src='/icons/dark_arrow_down.svg'
                            alt='Down arrow'
                          />
                        </div>
                        <div
                          className={`${filterFocus === category ? '' : 'hidden'}`}>
                          {filterOptions[category].map((item, index) => {
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  updateFilterData(category, item);
                                }}
                                className={twMerge(
                                  'text-primarytext flex cursor-pointer select-none items-center bg-white px-4 py-2 hover:bg-slate-200',
                                  filterData !== undefined &&
                                    filterData[category].includes(item)
                                    ? ' bg-slate-400 hover:bg-slate-400'
                                    : '',
                                  index === filterOptions[category].length - 1
                                    ? ' rounded-bl rounded-br'
                                    : '',
                                )}>
                                {item}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                },
              );
            })()}
          </div>
        </div>
        <div className='relative flex'>
          <div
            onClick={handleSortToggle}
            className='border-primarytext text-primarytext ml-2 flex min-w-[100px] cursor-pointer select-none items-center rounded border bg-[#f7f7f7] py-1 pl-4 hover:bg-slate-500 hover:text-white'>
            {sortType}
            <img
              className='ml-1 mr-2 aspect-square h-[20px]'
              src='/icons/dark_arrow_down.svg'
              alt='Down arrow'
            />
          </div>
          <div
            className={`absolute left-2 text-nowrap text-white top-[50px]${sortToggle ? '' : ' hidden'}`}>
            <div
              onClick={() => {
                handleSortType('Date created (ascending)');
              }}
              className='cursor-pointer select-none rounded-tl-lg rounded-tr-lg bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Date created (ascending)
            </div>
            <div
              onClick={() => {
                handleSortType('Date created (descending)');
              }}
              className='cursor-pointer select-none bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Date created (descending)
            </div>
            <div
              onClick={() => {
                handleSortType('Role (ascending)');
              }}
              className='cursor-pointer select-none bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Role (ascending)
            </div>
            <div
              onClick={() => {
                handleSortType('Role (descending)');
              }}
              className='cursor-pointer select-none bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Role (descending)
            </div>
            <div
              onClick={() => {
                handleSortType('Name (ascending)');
              }}
              className='cursor-pointer select-none bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Name (ascending)
            </div>
            <div
              onClick={() => {
                handleSortType('Name (descending)');
              }}
              className='cursor-pointer select-none rounded-bl-lg rounded-br-lg bg-slate-700 px-4 py-2 hover:bg-slate-500'>
              Name (descending)
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            switchScreen(<CreateCandidate />);
          }}
          className='bg-secondary hover:bg-secondaryLight ml-4 cursor-pointer select-none rounded px-4 py-2 font-bold text-white'>
          Create Candidate
        </div>
      </div>
      <div className='w-full py-8'>
        <div className='flex w-full py-2'>
          <CandidateColumn data={currentCandidates} field='name' />
          <CandidateColumn data={currentCandidates} field='job_role' />
          <CandidateColumn data={currentCandidates} field='school' />
          <CandidateColumn data={currentCandidates} field='initial_event' />
          <CandidateColumn data={currentCandidates} field='select' />
        </div>
        <div className='mt-2 flex w-full'>
          <div className='font-bold'>
            Showing {numCandidatesShowing} of {totalCandidates}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
