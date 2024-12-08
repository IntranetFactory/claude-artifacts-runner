/* <artifact-specification>

I need a component that shows an analog wall clock. The clock displays the current time in San Francisco.

</artifact-specification> */

/*
   Creating a React component for an analog wall clock displaying the
   current time in San Francisco is a good artifact. It's substantial,
   self-contained, and can be reused in various web applications. The
   identifier is "san-francisco-analog-clock".
*/

import React, { useState, useEffect } from 'react';
  import { Clock, ClockHand } from '@/components/ui/clock';

  const SanFranciscoAnalogClock = () => {
    const [date, setDate] = useState(new Date());
    const timezoneOffset = -8 * 60; // San Francisco timezone offset in minutes

    useEffect(() => {
      const timer = setInterval(() => {
        const currentDate = new Date();
        const sanFranciscoDate = new Date(currentDate.getTime() + (timezoneOffset * 60 * 1000));
        setDate(sanFranciscoDate);
      }, 1000);
      return () => clearInterval(timer);
    }, [timezoneOffset]);

    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return (
      <div className="w-80 h-80 rounded-full border-2 border-gray-200 flex justify-center items-center">
        <Clock size={300}>
          <ClockHand type="hour" angle={(hours * 30) + (minutes * 0.5)} />
          <ClockHand type="minute" angle={(minutes * 6) + (seconds * 0.1)} />
          <ClockHand type="second" angle={seconds * 6} />
        </Clock>
      </div>
    );
  };

  export default SanFranciscoAnalogClock;