import React from 'react';
import { useParams } from 'react-router-dom';

// 导入所有活动详情组件
import SpringEducationExpo from './SpringEducationExpo';
import LifelongLearningFestival from './LifelongLearningFestival';
import SkillPromotionMonth from './SkillPromotionMonth';
import CareerCertificationCamp from './CareerCertificationCamp';
import OverseasExchange from './OverseasExchange';
import EnterpriseTrainingWeek from './EnterpriseTrainingWeek';

const ActivityDetail = () => {
  const { id } = useParams();

  let activityComponent;
  switch (id) {
    case '1':
      activityComponent = <SpringEducationExpo />;
      break;
    case '2':
      activityComponent = <LifelongLearningFestival />;
      break;
    case '3':
      activityComponent = <SkillPromotionMonth />;
      break;
    case '4':
      activityComponent = <CareerCertificationCamp />;
      break;
    case '5':
      activityComponent = <OverseasExchange />;
      break;
    case '6':
      activityComponent = <EnterpriseTrainingWeek />;
      break;
    default:
      activityComponent = (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-xl">活动页面未找到</p>
          </div>
        </div>
      );
  }

  return (
    <div>
      {activityComponent}
    </div>
  );
};

export default ActivityDetail; 