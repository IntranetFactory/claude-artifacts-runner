/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco.

</artifact-specification> */

/*
   Creating a React component for an analog wall clock that displays the
   current time in San Francisco is a good artifact. It involves
   handling time zones and rendering a clock face, which is substantial
   and self-contained.
*/

import React, { useState, useEffect } from 'react';
  import { Clock } from 'lucide-react';

  const AnalogClock = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }));

    useEffect(() => {
      const timerId = setInterval(() => {
        setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }));
      }, 1000);

      return () => clearInterval(timerId);
    }, []);

    const now = new Date();
    now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000) + (7 * 60 * 60000)); // Convert to San Francisco time
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    const secondHandStyle = {
      transform: `rotate(${(seconds * 6) - 90}deg)`,
    };
    const minuteHandStyle = {
      transform: `rotate(${(minutes * 6) + (seconds / 10) - 90}deg)`,
    };
    const hourHandStyle = {
      transform: `rotate(${(hours * 30) + (minutes / 2) - 90}deg)`,
    };

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative w-64 h-64 border-2 border-gray-300 rounded-full bg-white shadow-lg">
          <div className="absolute w-full h-full">
            <div className="absolute w-1 h-12 bg-black top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" style={hourHandStyle}></div>
            <div className="absolute w-0.5 h-16 bg-black top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" style={minuteHandStyle}></div>
            <div className="absolute w-0.5 h-20 bg-red-500 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" style={secondHandStyle}></div>
          </div>
          <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="mt-4 text-2xl font-bold">
          <Clock className="inline-block mr-2" size={24} />
          {time}
        </div>
      </div>
    );
  };

  export default AnalogClock;