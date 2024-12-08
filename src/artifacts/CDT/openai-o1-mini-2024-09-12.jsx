/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco.

</artifact-specification> */

/*
   Creating an analog wall clock component will display the current time
   in San Francisco, providing a visual and accessible way to show time.
*/

import React, { useState, useEffect } from "react";

const AnalogWallClock = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return convertToSanFranciscoTime(now);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(convertToSanFranciscoTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function convertToSanFranciscoTime(date) {
    return new Date(date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  }

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours + minutes / 60) * 30;
  const minuteDegrees = (minutes + seconds / 60) * 6;
  const secondDegrees = seconds * 6;

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative w-64 h-64 bg-white rounded-full shadow-lg border border-gray-200">
        <svg className="absolute top-0 left-0 w-full h-full" aria-label="Analog Clock showing San Francisco time">
          <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="2" fill="none" />
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50%"
              y1="2%"
              x2="50%"
              y2="8%"
              stroke="currentColor"
              strokeWidth="2"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            stroke="currentColor"
            strokeWidth="4"
            transform={`rotate(${hourDegrees} 50 50)`}
            aria-label="Hour hand"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${minuteDegrees} 50 50)`}
            aria-label="Minute hand"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="red"
            strokeWidth="1"
            transform={`rotate(${secondDegrees} 50 50)`}
            aria-label="Second hand"
          />
          <circle cx="50" cy="50" r="1" fill="currentColor" />
        </svg>
        <span className="sr-only">
          The current time in San Francisco is {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric" })}
        </span>
      </div>
    </div>
  );
};

export default AnalogWallClock;