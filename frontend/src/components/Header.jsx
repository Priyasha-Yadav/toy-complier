import React from 'react';
import { Code, Settings, Github, User } from 'lucide-react';

const Header = ({ user, theme, onThemeToggle, onLogin }) => {
  return (
    <header
      className={`header w-full shadow-md ${
        theme === 'dark'
          ? 'bg-[#3C2F2F] text-[#E8D8C4]'
          : 'bg-[#FCF7F0] text-[#D4A017]'
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code
                className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-[#D4A017]' : 'text-[#D2A679]'
                }`}
              />
              <h1 className="text-2xl font-bold">
                CodingGita IDE
              </h1>
            </div>
            <div className="text-sm opacity-80">
              C Compiler & Runtime
            </div>
          </div>

          {/* Right: Buttons/User */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className={`btn px-3 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-[#4A3728] hover:bg-[#6B543B] text-[#E8D8C4]'
                  : 'bg-[#F1E6D8] hover:bg-[#E2D1A8] text-[#D4A017]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {user ? (
              <div
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
                  theme === 'dark'
                    ? 'bg-[#4A3728] text-[#E8D8C4]'
                    : 'bg-[#F1E6D8] text-[#4B3B2A]'
                }`}
              >
                <User className="w-5 h-5" />
                <span>{user.name}</span>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className={`btn flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-[#4A3728] hover:bg-[#6B543B] text-[#E8D8C4]'
                    : 'bg-[#F1E6D8] hover:bg-[#E2D1A8] text-[#D4A017]'
                }`}
              >
                <Github className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
