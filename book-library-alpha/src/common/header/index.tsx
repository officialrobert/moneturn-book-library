import Logo from '../logo';
import { Link } from 'react-router';
import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const Header = () => {
  return (
    <div className="fixed top-0 h-[80px] w-full left-0 right-0 flex justify-between items-center pl-12 pr-12 box-border">
      <div className="relative flex justify-end items-center">
        <Link to="/" className="relative">
          <Logo />
        </Link>
      </div>

      <div className="relative flex justify-end items-center">
        <Button shape="circle">
          <SettingOutlined />
        </Button>
      </div>
    </div>
  );
};

export default Header;
