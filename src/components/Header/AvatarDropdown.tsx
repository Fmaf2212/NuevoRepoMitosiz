import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import SwitchDarkMode2 from "shared/SwitchDarkMode/SwitchDarkMode2";

import { useCounterStore } from "store/auth";

const AvatarDropdown = () => {
  const handleLogout = useCounterStore((state) => state.handleLogout);
  const isLoggedIn = useCounterStore((state) => state.isLoggedIn);
  const userDataForAvatarDropdown = useCounterStore((state) => state.userDataForAvatarDropdown);

  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                    {isLoggedIn ? (
                      <>
                        <div className="flex items-center space-x-3">
                          {
                            userDataForAvatarDropdown.imageUrl==="https://api.yosoymitosis.com/StaticFiles/ProfileImg/"
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="48px" height="48px" viewBox="0 0 368.000000 368.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,368.000000) scale(0.100000,-0.100000)" fill="#0d9488" stroke="none"><path d="M1694 3669 c-895 -65 -1619 -796 -1683 -1701 -72 -1009 691 -1886 1702 -1957 1007 -72 1885 692 1956 1701 46 645 -252 1265 -789 1640 -183 128 -456 243 -679 288 -87 17 -350 43 -386 38 -5 0 -60 -4 -121 -9z m324 -120 c577 -63 1084 -410 1346 -919 220 -429 255 -905 99 -1353 -31 -92 -113 -268 -151 -325 l-15 -23 -64 70 c-227 249 -574 453 -923 541 -279 70 -636 69 -923 -4 -360 -92 -711 -307 -951 -584 -45 -53 -40 -58 -126 110 -253 491 -253 1058 1 1558 321 632 1008 1006 1707 929z"></path><path d="M1684 3121 c-295 -80 -489 -346 -471 -646 10 -154 62 -276 169 -391 77 -82 152 -131 258 -168 76 -27 98 -30 200 -30 102 0 124 3 200 30 106 37 181 86 258 168 70 75 112 145 144 241 32 98 33 269 1 370 -61 193 -221 355 -413 416 -95 31 -253 35 -346 10z"></path></g></svg>
                            :
                            <Avatar
                              imgUrl={userDataForAvatarDropdown.imageUrl}
                              sizeClass="w-12 h-12"
                            />
                          }
                          

                          <div className="flex-grow">
                            <h4 className="font-semibold">{userDataForAvatarDropdown.names} {userDataForAvatarDropdown.lastName}</h4>
                          </div>
                        </div>

                        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                      </>
                    ) : (
                      <>
                        <div className="w-full flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="48px"
                            height="48px"
                            viewBox="0 0 368.000000 368.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,368.000000) scale(0.100000,-0.100000)"
                              fill="#0d9488"
                              stroke="none"
                            >
                              <path d="M1694 3669 c-895 -65 -1619 -796 -1683 -1701 -72 -1009 691 -1886 1702 -1957 1007 -72 1885 692 1956 1701 46 645 -252 1265 -789 1640 -183 128 -456 243 -679 288 -87 17 -350 43 -386 38 -5 0 -60 -4 -121 -9z m324 -120 c577 -63 1084 -410 1346 -919 220 -429 255 -905 99 -1353 -31 -92 -113 -268 -151 -325 l-15 -23 -64 70 c-227 249 -574 453 -923 541 -279 70 -636 69 -923 -4 -360 -92 -711 -307 -951 -584 -45 -53 -40 -58 -126 110 -253 491 -253 1058 1 1558 321 632 1008 1006 1707 929z" />
                              <path d="M1684 3121 c-295 -80 -489 -346 -471 -646 10 -154 62 -276 169 -391 77 -82 152 -131 258 -168 76 -27 98 -30 200 -30 102 0 124 3 200 30 106 37 181 86 258 168 70 75 112 145 144 241 32 98 33 269 1 370 -61 193 -221 355 -413 416 -95 31 -253 35 -346 10z" />
                            </g>
                          </svg>
                        </div>
                        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                      </>
                    )}
                    {/* ------------------ 1 --------------------- */}

                    {isLoggedIn ? (
                      <Link
                        to={"/editProfile"}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={() => close()}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{"Mi perfil"}</p>
                        </div>
                      </Link>
                    ) : null}

                    {/* ------------------ 2 --------------------- */}
                    <div className="flex items-center justify-between p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.0001 7.88989L10.9301 9.74989C10.6901 10.1599 10.8901 10.4999 11.3601 10.4999H12.6301C13.1101 10.4999 13.3001 10.8399 13.0601 11.2499L12.0001 13.1099"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.30011 18.0399V16.8799C6.00011 15.4899 4.11011 12.7799 4.11011 9.89993C4.11011 4.94993 8.66011 1.06993 13.8001 2.18993C16.0601 2.68993 18.0401 4.18993 19.0701 6.25993C21.1601 10.4599 18.9601 14.9199 15.7301 16.8699V18.0299C15.7301 18.3199 15.8401 18.9899 14.7701 18.9899H9.26011C8.16011 18.9999 8.30011 18.5699 8.30011 18.0399Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.5 22C10.79 21.35 13.21 21.35 15.5 22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">
                            {"Tema Oscuro"}
                          </p>
                        </div>
                      </div>
                      <SwitchDarkMode2 />
                    </div>
                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    {/* ------------------ 2 --------------------- */}
                    {isLoggedIn ? (
                      <button
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12.9999 2C10.2385 2 7.99991 4.23858 7.99991 7C7.99991 7.55228 8.44762 8 8.99991 8C9.55219 8 9.99991 7.55228 9.99991 7C9.99991 5.34315 11.3431 4 12.9999 4H16.9999C18.6568 4 19.9999 5.34315 19.9999 7V17C19.9999 18.6569 18.6568 20 16.9999 20H12.9999C11.3431 20 9.99991 18.6569 9.99991 17C9.99991 16.4477 9.55219 16 8.99991 16C8.44762 16 7.99991 16.4477 7.99991 17C7.99991 19.7614 10.2385 22 12.9999 22H16.9999C19.7613 22 21.9999 19.7614 21.9999 17V7C21.9999 4.23858 19.7613 2 16.9999 2H12.9999Z"
                              fill="currentColor"
                            />
                            <path
                              d="M13.9999 11C14.5522 11 14.9999 11.4477 14.9999 12C14.9999 12.5523 14.5522 13 13.9999 13V11Z"
                              fill="currentColor"
                            />
                            <path
                              d="M5.71783 11C5.80685 10.8902 5.89214 10.7837 5.97282 10.682C6.21831 10.3723 6.42615 10.1004 6.57291 9.90549C6.64636 9.80795 6.70468 9.72946 6.74495 9.67492L6.79152 9.61162L6.804 9.59454L6.80842 9.58848C6.80846 9.58842 6.80892 9.58778 5.99991 9L6.80842 9.58848C7.13304 9.14167 7.0345 8.51561 6.58769 8.19098C6.14091 7.86637 5.51558 7.9654 5.19094 8.41215L5.18812 8.41602L5.17788 8.43002L5.13612 8.48679C5.09918 8.53682 5.04456 8.61033 4.97516 8.7025C4.83623 8.88702 4.63874 9.14542 4.40567 9.43937C3.93443 10.0337 3.33759 10.7481 2.7928 11.2929L2.08569 12L2.7928 12.7071C3.33759 13.2519 3.93443 13.9663 4.40567 14.5606C4.63874 14.8546 4.83623 15.113 4.97516 15.2975C5.04456 15.3897 5.09918 15.4632 5.13612 15.5132L5.17788 15.57L5.18812 15.584L5.19045 15.5872C5.51509 16.0339 6.14091 16.1336 6.58769 15.809C7.0345 15.4844 7.13355 14.859 6.80892 14.4122L5.99991 15C6.80892 14.4122 6.80897 14.4123 6.80892 14.4122L6.804 14.4055L6.79152 14.3884L6.74495 14.3251C6.70468 14.2705 6.64636 14.1921 6.57291 14.0945C6.42615 13.8996 6.21831 13.6277 5.97282 13.318C5.89214 13.2163 5.80685 13.1098 5.71783 13H13.9999V11H5.71783Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <span
                          className="ml-4 text-sm font-medium"
                        >
                          Cerrar Sesión
                        </span>
                      </button>
                    ) : null}
                    {isLoggedIn ? null : (
                      <Link
                        to={"/login"}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={() => close()}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2 6.5C2 4.01472 4.01472 2 6.5 2H12C14.2091 2 16 3.79086 16 6V7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7V6C14 4.89543 13.1046 4 12 4H6.5C5.11929 4 4 5.11929 4 6.5V17.5C4 18.8807 5.11929 20 6.5 20H12C13.1046 20 14 19.1046 14 18V17C14 16.4477 14.4477 16 15 16C15.5523 16 16 16.4477 16 17V18C16 20.2091 14.2091 22 12 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5ZM18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071C17.9024 15.3166 17.9024 14.6834 18.2929 14.2929L19.5858 13L11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11L19.5858 11L18.2929 9.70711C17.9024 9.31658 17.9024 8.68342 18.2929 8.29289Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{"Login"}</p>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default AvatarDropdown;
