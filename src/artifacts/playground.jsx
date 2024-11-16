import React from 'react';
import DynamicComponent from '../components/dynamicComponent';

var code = `
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-center">Counter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold">{count}</div>
        <Button 
          onClick={() => setCount(count + 1)}
          className="w-full"
        >
          Increment
        </Button>
      </CardContent>
    </Card>
  );
};

export default Counter;
`


// The Playground component
const Playground = () => {
  const data = {
    name: 'Henry',
  };

  return <DynamicComponent code={code} data={data} />;
};

export default Playground;

