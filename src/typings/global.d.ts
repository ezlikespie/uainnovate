import { type ReactNode } from 'react';

declare global {
  interface FCChildren {
    children?: ReactNode;
  }
  interface FCClassname {
    className?: string;
  }
  interface FCChildrenClassname {
    className?: string;
    children?: ReactNode;
  }
  interface FCRequireChildren {
    children: ReactNode;
  }
  interface FCClassnameRequireChildren {
    className?: string;
    children: ReactNode;
  }
  interface UserCredential {
    email: string;
    password: string;
  }
}

export {};
