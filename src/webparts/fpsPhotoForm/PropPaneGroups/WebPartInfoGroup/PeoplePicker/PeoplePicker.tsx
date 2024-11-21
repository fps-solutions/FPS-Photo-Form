import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { ISiteUserInfo } from '@mikezimm/fps-core-v7/lib/types/@pnp/@2.14.0/sp/site-users';

export type ISharePointUserPreFilterRule = 'User' | 'UserWEmail' | 'All'; // User is PrincipalType 1 or 2, UserWEmail is more specific and more likely a real person vs a group

// Define the interface for the props
interface SharePointUserSearchProps {
  onUsersFetched?: (users: ISiteUserInfo[]) => void; // Optional callback to pass users back to parent
  debounceDelay?: number; // Optional debounce delay with default value of 200ms
  siteUrl?: string; // Optional SharePoint site URL
  size?: 'S' | 'M' | 'L';
  preFilter: ISharePointUserPreFilterRule;
  typeToShow: boolean; // if true, does not show any names until user types a search.  Data is loaded upon clicking the field
}

const SharePointUserSearch: React.FC<SharePointUserSearchProps> = ({
  onUsersFetched,
  debounceDelay = 200, // Default value for debounceDelay
  siteUrl = "/sites/YourSiteUrl", // Default site URL
  size = 'L',
  preFilter = 'UserWEmail',
  typeToShow = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<ISiteUserInfo[]>([]);
  const [allUsers, setAllUsers] = useState<ISiteUserInfo[]>([]); // Store all users - verified ISiteUserInfo is same object return from rest endpoint
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingMessage, setFetchingMessage] = useState<string>(''); // Message for fetching state

  // Fetch all users from SharePoint
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setFetchingMessage("Fetching site users...");

    // Try to filter on PrincipalType:4 to narrow the scope

    try {
      const response = await fetch(`${siteUrl}/_api/web/siteusers`, {
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      let results = data.d.results.map((user: any) => ({ ...user, ...{
        imageUrl: `${window.location.origin}/_layouts/15/userphoto.aspx?size=${size}&accountname=${user.Email ? user.Email : user.AccountName}`,
      }
      }));

      if ( preFilter === 'UserWEmail' ) results = results.filter((user: ISiteUserInfo ) => (user.PrincipalType === 1 || user.PrincipalType === 2) && !!user.Email );

      setAllUsers(results); // Save all users to state
      setUsers(results); // Initialize user list

      // Call the parent callback, if provided, to pass the users up
      if (onUsersFetched) {
        onUsersFetched(results);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
      setFetchingMessage(''); // Hide the fetching message once loading is done
    }
  }, [siteUrl, size, onUsersFetched]);

  // Debounced logic to filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setUsers(allUsers); // Show all users when search term is cleared
      return;
    }

    const handler = setTimeout(() => {
      // Filter users based on search term
      const filteredUsers = allUsers.filter(user =>
        user.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.Email && user.Email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setUsers(filteredUsers);
    }, debounceDelay);

    return () => clearTimeout(handler); // Cleanup on searchTerm change
  }, [searchTerm, allUsers, debounceDelay]);

  // Trigger the fetch of users when the input is focused
  const handleFocus = async (): Promise<void> => {
    if (allUsers.length === 0) {
      await fetchAllUsers(); // Await the fetchAllUsers call
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus} // Trigger fetch on focus
        placeholder="Search for a user..."
      />
      {loading && <p>{fetchingMessage}</p>} {/* Show loading message when fetching */}

      <ul>
        { !loading && !fetchingMessage && ( !searchTerm || typeToShow !== true ) && users.length > 0 ? 'Type a name to search users' : users.map((user) => (
          <li key={user.Id} style={{ display: 'flex' }}>
            <div style={{ minWidth: '36px', flexShrink: 0 }}><img src={ user.imageUrl } height={ '20px' }/></div> {user.Title} - {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharePointUserSearch;
