import React from 'react';
import Logo from '../../../assets/LearnLab-Logo-with-caption.svg'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-50 text-slate-800 dark:bg-slate-900 dark:text-gray-100">
       <div className="container px-4 py-10 md:py-14 max-w-7xl place-self-center">
        {/* Top Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Logo and About */}
          <div className="lg:col-span-4">
             <img src={Logo} alt="Logo" className="h-auto w-36" />
          </div>
 {/* Links Sections */}
 <div className="grid gap-8 sm:grid-cols-3 md:gap-4 lg:col-span-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Works
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Career
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Help</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Free eBooks
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Development Tutorial
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    How to - Blog
                  </Link>
                </li>
                <li>
                  <Link to={'#'} className="hover:text-blue-600 dark:hover:text-white">
                    Youtube Playlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Social Media</h3>
            <div className="flex gap-4 ">
              <Link
                to={"#"}
                className="rounded-full bg-blue-100 dark:bg-slate-700 p-2 hover:bg-blue-200 hover:text-blue-700"
              >
                <FaFacebookF className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to={"#"}
                className="rounded-full bg-blue-100 dark:bg-slate-700  p-2 hover:bg-blue-200 hover:text-blue-700"
              >
                <FaXTwitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                to={"#"}
                className="rounded-full bg-blue-100 dark:bg-slate-700  p-2 hover:bg-blue-200 hover:text-blue-700"
              >
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to={"#"}
                className="rounded-full bg-blue-100 dark:bg-slate-700  p-2 hover:bg-blue-200 hover:text-blue-700"
              >
                <FaLinkedinIn className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
       
        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#1E293B] pt-8 text-slate-800 dark:text-gray-400 md:flex-row">
          <p>&copy; 2025 LearnLab. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to={'#'} className="dark:hover:text-white hover:text-blue-700">
              Terms
            </Link>
            <Link to={'#'} className="dark:hover:text-white hover:text-blue-700">
              Privacy
            </Link>
            <Link to={'#'} className="dark:hover:text-white hover:text-blue-700">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
