import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

// Define the interface for the props
interface SharePointUserSearchProps {
  onUsersFetched?: (users: SharePointUser[]) => void; // Optional callback to pass users back to parent
  debounceDelay?: number; // Optional debounce delay with default value of 200ms
  siteUrl?: string; // Optional SharePoint site URL
  size?: 'S' | 'M' | 'L';
}

interface SharePointUser {
  Id: number;
  Title: string;
  Email: string;
  imageUrl: string;
}

const SharePointUserSearch: React.FC<SharePointUserSearchProps> = ({
  onUsersFetched,
  debounceDelay = 200, // Default value for debounceDelay
  siteUrl = "/sites/YourSiteUrl", // Default site URL
  size = 'L',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<SharePointUser[]>([]);
  const [allUsers, setAllUsers] = useState<SharePointUser[]>([]); // Store all users
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
      const results = data.d.results.map((user: any) => ({
        Id: user.Id,
        Title: user.Title,
        Email: user.Email,
        imageUrl: `${window.location.origin}/_layouts/15/userphoto.aspx?size=${size}&accountname=${user.Email ? user.Email : user.AccountName}`,
      }));

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
        {users.map((user) => (
          <li key={user.Id}>
            {user.Title} - {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharePointUserSearch;
