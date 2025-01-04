import React from 'react';
import Logo from '../../../assets/LearnLab-Logo-with-caption.svg'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-50  text-slate-800 dark:text-white py-8">
      <div className="container mx-auto px-4 max-w-7xl place-self-center">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Logo and About */}
          <div className="text-center md:text-left">
             <img src={Logo} alt="Logo" className="h-auto w-32" />
          </div>
          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-blue-600"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-blue-600"
              aria-label="Twitter"
            >
              <FaXTwitter />
            </a>
            <a
              href="#"
              className="hover:text-blue-600"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-blue-600"
              aria-label="LinkedIn"
            >
             <FaLinkedinIn />
            </a>
          </div>
        </div>
        {/* Divider */}
        <hr className="border-gray-700 mb-6" />
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 LearnLab. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
