import React from 'react';
import { Menu } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="text-2xl font-bold">Bloocode</div>
      <Menu mode="horizontal" className="flex-1 justify-center hidden md:flex">
        <Menu.Item key="home">Home</Menu.Item>
        <Menu.Item key="categories">Categories</Menu.Item>
        <Menu.Item key="top">Top Podcasts</Menu.Item>
      </Menu>
      <div className="flex gap-4">
        <SearchOutlined className="text-xl cursor-pointer" />
        <UserOutlined className="text-xl cursor-pointer" />
      </div>
    </div>
  </header>
);

export default Header;