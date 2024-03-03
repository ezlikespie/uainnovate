import { NewCandidateSelfCredential } from '../views/Dashboard/CandidateSelfRegister';
import { type NewCandidateCredential } from '../views/Dashboard/CreateCandidate';
import isEmail from 'validator/es/lib/isEmail';

// Register validation
const validateRegister = (cred: UserCredential): string[] => {
  const errors = [];
  // Must be an email
  if (!isEmail(cred.email)) errors.push('Invalid email');
  // Password min length
  if (cred.password.length < 8)
    errors.push('Password must be at least 8 characters');
  return errors;
};

// Login validation
const validateLogin = (cred: UserCredential): string[] => {
  const errors = [];
  // Must be an email
  if (!isEmail(cred.email)) errors.push('Please use a valid email');
  // Password min length
  if (cred.password.length < 8)
    errors.push('Your password will be at least 8 characters');
  return errors;
};

// Create candidate validation
const validateCreateCandidate = (cred: NewCandidateCredential): string[] => {
  const errors = [];
  // Must have first name and last name
  if (cred.firstName === '') errors.push('You must provide a first name');
  if (cred.lastName === '') errors.push('You must provide a last name');
  if (cred.role === '') errors.push('You must provide a role');
  if (cred.school === '') errors.push('You must provide a school');
  if (cred.initialEvent === '')
    errors.push('You must provide an initial event');
  return errors;
};

// Create candidate validation
const validateCreateSelfCandidate = (
  cred: NewCandidateSelfCredential,
): string[] => {
  const errors = [];
  // Must have first name and last name
  if (cred.email === '') errors.push('You must provide an email');
  else if (!isEmail(cred.email)) errors.push('Invalid email');
  if (cred.password === '') errors.push('You must provide a password');
  else if (cred.password.length < 8)
    errors.push('Password must be at least 8 characters');
  if (cred.firstName === '') errors.push('You must provide a first name');
  if (cred.lastName === '') errors.push('You must provide a last name');
  if (cred.role === '') errors.push('You must provide a role');
  if (cred.school === '') errors.push('You must provide a school');
  if (cred.initialEvent === '')
    errors.push('You must provide an initial event');
  return errors;
};

export {
  validateRegister,
  validateLogin,
  validateCreateCandidate,
  validateCreateSelfCandidate,
};
