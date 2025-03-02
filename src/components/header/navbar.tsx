import { Link } from '@tanstack/react-router';

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between bg-base-100 ">
        <ul className="flex gap-4">
          <li>
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
          </li>
          {/* <li>
            <Link
              to="/about"
              activeProps={{
                className: 'font-bold',
              }}
            >
              About
            </Link>
          </li> */}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
