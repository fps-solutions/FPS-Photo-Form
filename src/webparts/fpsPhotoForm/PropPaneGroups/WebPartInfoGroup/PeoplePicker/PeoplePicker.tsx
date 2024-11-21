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
  typeToShow: boolean; // if true, does not show any names until user types a search. Data is loaded upon clicking the field
  multiSelect?: boolean; // New prop: true for multi-select, false for single-select
}

const SharePointUserSearch: React.FC<SharePointUserSearchProps> = ({
  onUsersFetched,
  debounceDelay = 200, // Default value for debounceDelay
  siteUrl = "/sites/YourSiteUrl", // Default site URL
  size = 'L',
  preFilter = 'UserWEmail',
  typeToShow = false,
  multiSelect = true, // Default to multi-select
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<ISiteUserInfo[]>([]);
  const [allUsers, setAllUsers] = useState<ISiteUserInfo[]>([]); // Store all users - verified ISiteUserInfo is same object return from rest endpoint
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingMessage, setFetchingMessage] = useState<string>(''); // Message for fetching state
  const [selectedUsers, setSelectedUsers] = useState<ISiteUserInfo[]>([]); // New: Track selected users

  // Fetch all users from SharePoint
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setFetchingMessage("Fetching site users...");

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
      let results = data.d.results.map((user: any) => ({
        ...user,
        imageUrl: `${window.location.origin}/_layouts/15/userphoto.aspx?size=${size}&accountname=${user.Email ? user.Email : user.AccountName}`,
      }));

      if (preFilter === 'UserWEmail') {
        results = results.filter((user: ISiteUserInfo) => (user.PrincipalType === 1 || user.PrincipalType === 2) && !!user.Email);
      }

      setAllUsers(results); // Save all users to state
      setUsers(results); // Initialize user list

      if (onUsersFetched) {
        onUsersFetched(results); // Pass users to parent if callback provided
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
      setFetchingMessage(''); // Hide the fetching message once loading is done
    }
  }, [siteUrl, size, onUsersFetched, preFilter]);

  // Debounced logic to filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setUsers(allUsers); // Show all users when search term is cleared
      return;
    }

    const handler = setTimeout(() => {
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

  // Handle user selection
  const handleCheckboxChange = (user: ISiteUserInfo) => {
    if (multiSelect) {
      setSelectedUsers((prev) => {
        if (prev.some((u) => u.Id === user.Id)) {
          return prev.filter((u) => u.Id !== user.Id); // Remove user if already selected
        }
        return [...prev, user]; // Add user if not already selected
      });
    } else {
      setSelectedUsers([user]); // For single select, only allow one user
    }
  };

  // Handle removing a user from the selected list
  const removeSelectedUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.Id !== userId));
  };

  return (
    <div>
      {/* Display selected users */}
      <div style={{ marginBottom: '10px' }}>
        {selectedUsers.map((user) => (
          <span key={user.Id} style={{ marginRight: '8px', display: 'inline-flex', alignItems: 'center', backgroundColor: '#f1f1f1', padding: '4px 8px', borderRadius: '12px' }}>
            <img src={user.imageUrl} alt={user.Title} style={{ height: '20px', marginRight: '4px' }} />
            {user.Title}
            <button
              style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => removeSelectedUser(user.Id)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus} // Trigger fetch on focus
        placeholder="Search for a user..."
      />
      {loading && <p>{fetchingMessage}</p>} {/* Show loading message when fetching */}

      {/* User list */}
      <ul>
        {!loading &&
          !fetchingMessage &&
          (typeToShow === false || searchTerm) &&
          users.map((user) => (
            <li key={user.Id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedUsers.some((u) => u.Id === user.Id)}
                onChange={() => handleCheckboxChange(user)}
              />
              <img src={user.imageUrl} alt={user.Title} height="20" style={{ marginLeft: '8px', marginRight: '8px' }} />
              {user.Title} - {user.Email}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SharePointUserSearch;
