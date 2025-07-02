import React from 'react';

const Terms = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">使用条款</h1>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>用户在使用本平台服务时，必须遵守所有适用的法律法规。</li>
        <li>禁止发布任何违法、侵权、虚假或不良信息。</li>
        <li>我们致力于保护用户数据安全，但用户也需妥善保管自己的账户信息。</li>
        <li>平台保留根据业务需要调整服务内容的权利。</li>
      </ul>
    </div>
  </div>
);

export default Terms; 