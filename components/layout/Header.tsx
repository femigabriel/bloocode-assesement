"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Menu, Input } from "antd";
import Image from "next/image";
import { SearchOutlined } from "@ant-design/icons";

const menuItems = [
  {
    key: "/",
    label: <Link href="/">Home</Link>,
  },
  {
    key: "/company",
    label: <Link href="/company">Company</Link>,
  },
  {
    key: "/resources",
    label: <Link href="/resources">Resources</Link>,
  },
  {
    key: "/contact",
    label: <Link href="/contact">Contact Us</Link>,
  },
  {
    key: "/advertise",
    label: <Link href="/advertise">Advertise</Link>,
  },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search term:", e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white h-[72px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Image
            src="/assets/images/ABR Logo 1.svg"
            alt="logo"
            width={20}
            height={20}
            className="w-[80px] md:w-[108px] h-auto"
            draggable="false"
          />
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          className="flex-1 justify-center hidden md:flex"
        />

        <div className="header">
       
          <Input
            onChange={onSearch}
            placeholder="Search"
              name="search"
            prefix={<SearchOutlined className="text-white" />}
            className=" bg-[#00000052] h-[40px] rounded-[32px]"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
