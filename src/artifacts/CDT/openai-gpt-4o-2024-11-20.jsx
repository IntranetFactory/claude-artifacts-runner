/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco.

</artifact-specification> */

/*
   A React component can render an analog clock using JSX and CSS,
   keeping it in sync with San Francisco time by calculating and
   updating the clock's hands periodically.
*/

import React, { useEffect, useState } from 'react';

  const AnalogWallClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        const utcTime = new Date();
        const sanFranciscoOffset = -7; // UTC-7
        const sanFranciscoTime = new Date(
          utcTime.getTime() + sanFranciscoOffset * 60 * 60 * 1000
        );
        setTime(sanFranciscoTime);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const getDegrees = (unit) => {
      switch (unit) {
        case 'hours':
          return (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
        case 'minutes':
          return time.getMinutes() * 6;
        case 'seconds':
          return time.getSeconds() * 6;
        default:
          return 0;
      }
    };

    return (
      <div
        className="relative w-64 h-64 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center"
        role="img"
        aria-label={`Analog clock showing time in San Francisco: ${time.toLocaleTimeString()}`}
      >
        {/* Hour hand */}
        <div
          className="absolute w-2 h-16 bg-gray-900 rounded-sm origin-bottom"
          style={{ transform: `rotate(${getDegrees('hours')}deg)` }}
        ></div>

        {/* Minute hand */}
        <div
          className="absolute w-1 h-24 bg-gray-700 rounded-sm origin-bottom"
          style={{ transform: `rotate(${getDegrees('minutes')}deg)` }}
        ></div>

        {/* Second hand */}
        <div
          className="absolute w-0.5 h-28 bg-red-600 rounded-sm origin-bottom"
          style={{ transform: `rotate(${getDegrees('seconds')}deg)` }}
        ></div>

        {/* Clock center */}
        <div className="absolute w-4 h-4 bg-black rounded-full"></div>

        {/* Hour marks */}
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-6 bg-gray-800 rounded-sm origin-center"
            style={{ transform: `rotate(${index * 30}deg)` }}
          ></div>
        ))}
      </div>
    );
  };

  export default AnalogWallClock;