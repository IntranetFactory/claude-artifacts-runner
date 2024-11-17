/* <prompt>

show data from https://jsonplaceholder.typicode.com/users

</prompt> */

import React from 'react';
import ApiAccess from '@/components/apiAccess';

  const UserData = () => (
    <ApiAccess url="https://jsonplaceholder.typicode.com/users">
      {(data) => (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">User List</h1>
          <ul className="list-disc pl-5">
            {data.map(user => (
              <li key={user.id} className="mb-2">
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ApiAccess>
  );

  export default UserData;
