import menuItems from './menus/primary.json';
import NavItem, { type NavItemData } from './NavItem';
import { twMerge } from 'tailwind-merge';

const Navbar: React.FC<FCClassname> = (props) => {
  return (
    <div
      className={twMerge(
        `flex w-full shrink-0 grow-0 basis-auto justify-center border-b-2 border-[#d2d2d2] px-8 shadow-lg dark:bg-slate-700 xl:px-16 ${props.className}`,
      )}>
      <div className='relative flex h-[70px] w-full max-w-[1280px]'>
        <div className='absolute left-0 flex h-full flex-col justify-center'>
          <a href='/'>
            <img className='h-[35px]' src='/logo.svg' alt='CGI Logo' />
          </a>
        </div>
        <nav className='absolute right-0 h-full'>
          <ul className='flex h-full items-center'>
            {menuItems.map((item, index) => {
              return <NavItem key={index} data={item as NavItemData} />;
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
