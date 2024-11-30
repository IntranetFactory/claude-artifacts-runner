/* <react-artifact>

show data from https://jsonplaceholder.typicode.com/users in table

</react-artifact> */

import React from 'react';
  import ApiAccess from '@/components/apiAccess';
  
  const UserDataTable = () => (
    <ApiAccess url="https://jsonplaceholder.typicode.com/users">
      {(data) => (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {data.map(user => (
                <tr key={user.id}>
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ApiAccess>
  );
  
  export default UserDataTable;