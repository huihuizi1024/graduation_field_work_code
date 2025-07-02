import React from 'react';

const Privacy = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">隐私政策</h1>
      <p className="text-gray-700 mb-4">
        我们非常重视您的个人隐私，并承诺将依据本隐私政策来处理您的个人信息。
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>您的个人信息仅用于提供和改进我们的平台服务，绝不会泄露给任何无关的第三方。</li>
        <li>我们采取行业标准的安全措施来保护您的数据，防止未经授权的访问和使用。</li>
        <li>您有权随时访问、更正或删除您的个人信息。</li>
      </ul>
    </div>
  </div>
);

export default Privacy; 