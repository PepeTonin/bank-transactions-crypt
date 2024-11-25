"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import {
  ChartLineData01Icon,
  MoneySendSquareIcon,
  Home09Icon,
  Menu02Icon,
  Logout03Icon,
} from "hugeicons-react";

import FazerTransacao from "@/templates/FazerTransacao";
import HomeTab from "@/templates/Home";

import { cleanLocalStorage } from "@/utils/rsa";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser, setIsAuthenticated } from "@/store/features/authSlice";

enum Tabs {
  TRANSACTION = 0,
  TRANSACTION_HISTORY = 1,
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(-1);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isAuthenticating } = useAppSelector(
    (state) => state.auth
  );

  function MainContent() {
    switch (selectedTab) {
      case Tabs.TRANSACTION:
        return <FazerTransacao />;
      case Tabs.TRANSACTION_HISTORY:
        return <></>;
      default:
        return <HomeTab />;
    }
  }

  function handleLogout() {
    dispatch(setUser(undefined));
    dispatch(setIsAuthenticated(false));
    cleanLocalStorage("user");
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-1 flex-row h-lvh">
      <aside className="h-full w-[80px] bg-neutral-100 border-r-2 border-r-neutral-200 flex flex-col items-center gap-6 py-6 shadow-xl">
        <div className="flex flex-col gap-6 flex-1">
          <Home09Icon
            size={42}
            className="text-neutral-600 cursor-pointer hover:opacity-80 transition-transform-opacity hover:scale-105"
            onClick={() => setSelectedTab(-1)}
          />
          <MoneySendSquareIcon
            size={42}
            className="text-neutral-600 cursor-pointer hover:opacity-80 transition-transform-opacity hover:scale-105"
            onClick={() => setSelectedTab(Tabs.TRANSACTION)}
          />
          <ChartLineData01Icon
            size={42}
            className="text-neutral-600 cursor-pointer hover:opacity-80 transition-transform-opacity hover:scale-105"
            onClick={() => setSelectedTab(Tabs.TRANSACTION_HISTORY)}
          />
        </div>
        <div>
          <Popover placement="right">
            <PopoverTrigger>
              <Menu02Icon
                size={42}
                className="text-neutral-600 cursor-pointer hover:opacity-80 transition-transform-opacity hover:scale-105"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div
                className="px-4 py-2 text-red-500 flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 transition-transform-opacity hover:scale-105"
                onClick={handleLogout}
              >
                <p className="text-lg font-bold">Logout</p>
                <Logout03Icon size={24} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
      <main className="flex-1">
        <MainContent />
      </main>
    </div>
  );
}
