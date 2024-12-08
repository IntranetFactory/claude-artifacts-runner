/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco. 

</artifact-specification> */

import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [hour, minute, second] = time.split(/:| /);
  const hourAngle = (Number(hour) % 12 + Number(minute) / 60) * 30;
  const minuteAngle = Number(minute) * 6;
  const secondAngle = Number(second) * 6;

  return (
    <div className="flex items-center justify-center w-64 h-64 rounded-full bg-gray-200 border-4 border-gray-300">
      <div className="absolute w-1 h-28 bg-black rounded-full origin-bottom transform rotate-[-90deg]" style={{ transform: `rotate(${hourAngle}deg)` }} />
      <div className="absolute w-1 h-36 bg-black rounded-full origin-bottom transform rotate-[-90deg]" style={{ transform: `rotate(${minuteAngle}deg)` }} />
      <div className="absolute w-0.5 h-40 bg-red-500 rounded-full origin-bottom transform rotate-[-90deg]" style={{ transform: `rotate(${secondAngle}deg)` }} />
      <div className="w-3 h-3 rounded-full bg-black" />
    </div>
  );
};

export default AnalogClock;