import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Create a formatter for San Francisco time
    const sfTimeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // Update time every second
    const timer = setInterval(() => {
      const sfTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      setTime(sfTime);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Calculate rotation angles for clock hands
  const secondDegrees = time.getSeconds() * 6;
  const minuteDegrees = time.getMinutes() * 6 + secondDegrees / 60;
  const hourDegrees = (time.getHours() % 12) * 30 + minuteDegrees / 12;

  return (
    <div className="relative w-64 h-64 border-4 border-gray-800 rounded-full bg-white shadow-lg">
      {/* Clock Face Markings */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-3 bg-gray-700 origin-bottom"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-120px)`
          }}
        />
      ))}

      {/* Hour Hand */}
      <div 
        className="absolute w-2 bg-black origin-bottom rounded-full"
        style={{
          height: '80px',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${hourDegrees}deg)`
        }}
      />

      {/* Minute Hand */}
      <div 
        className="absolute w-1 bg-gray-700 origin-bottom rounded-full"
        style={{
          height: '110px',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${minuteDegrees}deg)`
        }}
      />

      {/* Second Hand */}
      <div 
        className="absolute w-0.5 bg-red-600 origin-bottom rounded-full"
        style={{
          height: '130px',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${secondDegrees}deg)`
        }}
      />

      {/* Center Dot */}
      <div className="absolute w-3 h-3 bg-black rounded-full" style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}/>

      {/* City Label */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center text-sm text-gray-600">
        <Clock className="mr-1 w-4 h-4" />
        San Francisco
      </div>
    </div>
  );
};

export default AnalogClock;
