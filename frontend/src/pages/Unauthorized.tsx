import { NavLink } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <h1 className="text-2xl">You do not have permission to view this page.</h1>
      <NavLink to={'/login'} className='bg-slate-400'>GO BACK TO LOGIN</NavLink>
    </div>
  );
};

export default Unauthorized;
