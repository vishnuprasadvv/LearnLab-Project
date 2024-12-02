import * as Yup from 'yup';

// Reusable password validation schema
export const formikPasswordValidation = () => {
  return Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .test('min-length', 'Must be at least 6 characters', (value) =>
      value ? value.length >= 6 : false
    )
    .test('has-uppercase', 'Must contain at least one uppercase letter', (value) =>
      value ? /[A-Z]/.test(value) : false
    )
    .test('has-lowercase', 'Must contain at least one lowercase letter', (value) =>
      value ? /[a-z]/.test(value) : false
    )
    .test('has-number', 'Must contain at least one number', (value) =>
      value ? /\d/.test(value) : false
    )
    .test(
      'has-special-char',
      'Must contain at least one special character (@, $, !, %, *, ?, &)',
      (value) => (value ? /[@$!%*?&]/.test(value) : false)
    );
};


