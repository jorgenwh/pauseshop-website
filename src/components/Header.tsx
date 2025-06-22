/**
 * Component for the page header
 */
import { TEXT } from '../lib/constants';

const Header: React.FC = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-center">
        <span className="text-white">Pause</span>
        <span className="text-[#30B3A4]">Shop</span>
      </h1>
      <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
        {TEXT.appDescription}
      </p>
    </>
  );
};

export default Header;