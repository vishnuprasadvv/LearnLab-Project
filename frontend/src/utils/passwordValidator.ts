export const validatePassword = (value:string) => {
    const errors = [];
  
    if (!/[A-Z]/.test(value)) {
      errors.push("At least one uppercase letter");
    }
  
    if (!/[a-z]/.test(value)) {
      errors.push("At least one lowercase letter");
    }
  
    if (!/\d/.test(value)) {
      errors.push("At least one number");
    }
  
    if (!/[@$!%*?&]/.test(value)) {
      errors.push("At least one special character (@, $, !, %, *, ?, &)");
    }
  
    if (value.length < 8) {
      errors.push("Minimum length of 8 characters");
    }
  
    return errors.length ? errors : null;
  };
  