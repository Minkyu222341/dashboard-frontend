import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white">헬프센터 대시보드</h1>
        <p className="text-blue-100 mt-1">실시간 지원 요청 모니터링</p>
      </div>
    </header>
  );
};

export default Header;
