import { Link } from 'react-router';
import { SettingOutlined } from '@ant-design/icons';

import Logo from '@/common/logo';

const Header = () => {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] fixed z-[10] top-0 h-[80px] w-full left-0 right-0 flex justify-between items-center pl-6 pr-6 md:pl-12 md:pr-12 box-border">
      <div className="relative flex justify-end items-center">
        <Link to="/" className="relative">
          <Logo />
        </Link>
      </div>

      <div className="relative flex justify-end items-center">
        <Link to="/settings" className="box-border p-2 flex decoration-none">
          <SettingOutlined />
        </Link>
      </div>
    </div>
  );
};

export default Header;
