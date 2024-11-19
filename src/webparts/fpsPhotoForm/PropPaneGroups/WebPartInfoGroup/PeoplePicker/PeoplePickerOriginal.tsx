
/**
 * THIS DID NOT WORK well as you can not pre-filter users via the api.
 *
 */
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
  const [loading, setLoading] = useState<boolean>(false);

  // Debounced function to handle API calls
  const fetchUsers = useCallback(
    async (term: string) => {
      if (!term) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const encodedTerm = encodeURIComponent(term);
        // Construct the SharePoint REST API URL
        const response = await fetch(
          `${siteUrl}/_api/web/siteusers?$filter=substringof('DisplayName', '${term}')`, // This did not search any case
          {
            headers: {
              Accept: "application/json;odata=verbose",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const results = data.d.results.map((user: any) => ({
          Id: user.Id,
          Title: user.Title,
          Email: user.Email,
          imageUrl: `${window.location.origin}/_layouts/15/userphoto.aspx?size=S&accountname=${user.Email ? user.Email : user.AccountName}`,
        }));

        setUsers(results);

        // Call the parent callback, if provided, to pass the users up
        if (onUsersFetched) {
          onUsersFetched(results);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [siteUrl, onUsersFetched]
  );

  // Debounced logic
  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        await fetchUsers(searchTerm);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [searchTerm, fetchUsers, debounceDelay]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a user..."
      />
      {loading && <p>Loading...</p>}
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