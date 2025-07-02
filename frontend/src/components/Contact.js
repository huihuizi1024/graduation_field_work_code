import React from 'react';

const Contact = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">联系我们</h1>
      <div className="space-y-4 text-lg">
        <p className="text-gray-700"><strong>客服电话：</strong> 400-123-4567</p>
        <p className="text-gray-700"><strong>电子邮箱：</strong> contact@zhixue.com</p>
        <p className="text-gray-700"><strong>办公地址：</strong> 某某市某某区创新大道123号知学大厦</p>
        <p className="text-gray-600 mt-4">我们随时欢迎您的垂询，期待与您共同成长。</p>
      </div>
    </div>
  </div>
);

export default Contact; 