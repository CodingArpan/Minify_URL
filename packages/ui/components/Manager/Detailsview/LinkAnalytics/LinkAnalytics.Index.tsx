import React from 'react'
import Filters from './Filters';
import LinkLists from './LinkLists';

const LinkAnalyticsIndex = () => {
    return (
      <div className="flex flex-col space-y-5">
        <div className="capitalize text-2xl text-blue-600 border-b border-slate-200 pb-3">
          Link & Analytics
        </div>
        <Filters/>
        <LinkLists/>
      </div>
    );
  };

export default LinkAnalyticsIndex