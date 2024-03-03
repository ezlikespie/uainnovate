import './NavItem.scss';

import { AuthContext } from './AuthProvider';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuObject {
  name: string;
  show?: string;
}
interface MenuObjectPath extends MenuObject {
  path: string;
  action: never;
  outline?: boolean;
}
interface MenuObjectAction extends MenuObject {
  path: never;
  action: string;
  outline?: boolean;
}
interface MenuObjectChild {
  name: string;
  show?: string;
}
interface MenuObjectChildPath extends MenuObjectChild {
  path: string;
  action: never;
  children: never;
}
interface MenuObjectChildAction extends MenuObjectChild {
  path: never;
  action: string;
  children: never;
}
interface MenuObjectChildren extends MenuObject {
  action: never;
  path: never;
  outline: never;
  children: MenuObjectChildPath[] | MenuObjectChildAction[];
}
export type NavItemData =
  | MenuObjectPath
  | MenuObjectAction
  | MenuObjectChildren;
interface NavItemProps {
  data: NavItemData;
}

const NavItem: React.FC<NavItemProps> = (props) => {
  const { loggedIn, logout, isAdmin } = useContext(AuthContext);
  const data = props.data;

  const navigate = useNavigate();
  useEffect(() => {
    if ('action' in data && data.action === 'logout' && !loggedIn)
      navigate('/');
  }, [loggedIn]);

  useEffect(() => {}, [isAdmin]);

  // Parent show condition
  if (data.show === 'loggedIn' && !loggedIn) return null;
  if (data.show === 'loggedOut' && loggedIn) return null;
  if (data.show === 'HR-Admin' && !isAdmin) return null;

  // Normal link item (Parent level)
  if ('path' in data) {
    const dataPath = data as MenuObjectPath;
    return (
      <li className='mx-4 flex h-[40px] items-center'>
        <a
          href={dataPath.path}
          className={`block select-none tracking-[0.08em] font-extrabold${
            dataPath.outline ?? false
              ? ' flex h-full items-center rounded-lg bg-slate-700 px-4 text-white hover:bg-slate-500'
              : ' text-primarytext hover:text-secondary'
          }`}>
          {dataPath.name}
        </a>
      </li>
    );
  }
  // Action item (Parent level)
  else if ('action' in data) {
    const dataAction = data as MenuObjectAction;
    const actionFunction = dataAction.action === 'logout' ? logout : () => {};
    return (
      <li
        className={`${
          dataAction.outline !== undefined && dataAction.outline
            ? 'rounded-lg bg-slate-700 px-4 text-white hover:bg-slate-500'
            : 'text-primarytext hover:text-secondary'
        } mx-2 flex h-[40px] cursor-pointer select-none items-center font-extrabold tracking-[0.08em]`}
        onClick={actionFunction}>
        {dataAction.name}
      </li>
    );
  }
  // Has children (Parent level)
  const dataChildren = data as MenuObjectChildren;
  return (
    <li className='px-4'>
      <div className='dropdown relative flex flex-col'>
        <div className='text-primarytext hover:text-secondary flex cursor-pointer select-none items-center self-end rounded-lg font-extrabold tracking-[0.08em]'>
          {dataChildren.name}
          <img
            src='/icons/arrow_down_cgi.svg'
            className='ml-2 inline aspect-square h-[12px]'
          />
          <div
            onClick={(e) => {
              const parentClasses =
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ((e.target as HTMLElement)!.parentNode!
                  .parentNode as HTMLElement)!.classList;
              if (parentClasses.contains('active'))
                parentClasses.remove('active');
              else parentClasses.add('active');
            }}
            className='absolute left-0 top-0 z-10 h-full w-full rounded-lg'
          />
        </div>
        <ul className='dropdown-content absolute right-0 top-[36px] z-30 flex-col rounded-lg bg-slate-700 shadow-xl'>
          {dataChildren.children.map((item2, index2) => {
            // Child show condition
            if (item2.show === 'loggedIn' && !loggedIn) return null;
            if (item2.show === 'loggedOut' && loggedIn) return null;
            if (item2.show === 'HR-Admin' && !isAdmin) return null;
            // Normal link item (Child level)
            if ('path' in item2) {
              const item2Path = item2 as MenuObjectChildPath;
              return (
                <li key={index2} className='flex h-[40px] w-full items-center'>
                  <a
                    href={item2Path.path}
                    className='flex h-full w-full select-none items-center text-nowrap bg-slate-700 px-4 font-extrabold tracking-[0.08em] text-white hover:bg-slate-500'>
                    {item2Path.name}
                  </a>
                </li>
              );
            }
            // Action item (Child level)
            const item2Action = item2 as MenuObjectChildAction;
            const actionFunction =
              item2Action.action === 'logout' ? logout : () => {};
            return (
              <li
                key={index2}
                className='dropdown-action flex h-[40px] w-full cursor-pointer select-none items-center text-nowrap bg-slate-700 px-4 font-extrabold tracking-[0.08em] text-white hover:bg-slate-500'
                onClick={actionFunction}>
                {item2Action.name}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};

export default NavItem;
