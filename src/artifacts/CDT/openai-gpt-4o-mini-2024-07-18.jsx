/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco.

</artifact-specification> */

/*
   Creating a React component to display an analog wall clock that shows
   the current time in San Francisco is a great artifact. It combines
   functionality with a visual representation and can be reused as a
   standalone feature. The identifier is "analog-wall-clock".
*/

import React, { useEffect, useState } from 'react';

  const AnalogClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timerId = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timerId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const calculateRotation = (degree) => degree * 6;

    return (
      <div className="relative w-64 h-64 rounded-full border-8 border-gray-200 shadow-lg flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full flex items-center justify-center">
          <div
            className="absolute w-1 h-24 bg-black"
            style={{ transform: `rotate(${calculateRotation(hours % 12)}deg)`, transformOrigin: 'bottom' }}
            aria-label="Hour hand"
          />
          <div
            className="absolute w-1 h-32 bg-red-600"
            style={{ transform: `rotate(${calculateRotation(minutes)}deg)`, transformOrigin: 'bottom' }}
            aria-label="Minute hand"
          />
          <div
            className="absolute w-1 h-36 bg-gray-800"
            style={{ transform: `rotate(${calculateRotation(seconds)}deg)`, transformOrigin: 'bottom' }}
            aria-label="Second hand"
          />
        </div>
        <div className="absolute text-center text-lg font-bold">
          <span>{time.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })}</span>
        </div>
      </div>
    );
  };

  export default AnalogClock;