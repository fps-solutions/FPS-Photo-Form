import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ISiteUserInfo } from '@mikezimm/fps-core-v7/lib/types/@pnp/@2.14.0/sp/site-users';
import './fps-People-Picker.css'; // Import the CSS file

export type ISharePointUserPreFilterRule = 'User' | 'UserWithEmail' | 'All';

interface SharePointUserSearchProps {
  onUsersFetched?: (users: ISiteUserInfo[]) => void;
  debounceDelay?: number;
  siteUrl?: string;
  size?: 'S' | 'M' | 'L';
  preFilter: ISharePointUserPreFilterRule;
  typeToShow: boolean;
  multiSelect?: boolean;
}

const SharePointUserSearch: React.FC<SharePointUserSearchProps> = ({
  onUsersFetched,
  debounceDelay = 200,
  siteUrl = "/sites/YourSiteUrl",
  size = 'L',
  preFilter = 'UserWithEmail',
  typeToShow = false,
  multiSelect = true,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<ISiteUserInfo[]>([]);
  const [allUsers, setAllUsers] = useState<ISiteUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingMessage, setFetchingMessage] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<ISiteUserInfo[]>([]);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results = data.d.results.map((user: any) => ({
        ...user,
        imageUrl: `${window.location.origin}/_layouts/15/userphoto.aspx?size=${size}&accountname=${user.Email ? user.Email : user.AccountName}`,
      }));

      if (preFilter === 'UserWithEmail') {
        results = results.filter((user: ISiteUserInfo) => (user.PrincipalType === 1 || user.PrincipalType === 2) && !!user.Email);
      }

      setAllUsers(results);
      setUsers(results);

      if (onUsersFetched) {
        onUsersFetched(results);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
      setFetchingMessage('');
    }
  }, [siteUrl, size, onUsersFetched, preFilter]);

  useEffect(() => {
    if (!searchTerm) {
      setUsers(allUsers);
      return;
    }

    const handler = setTimeout(() => {
      const filteredUsers = allUsers.filter(user =>
        user.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.Email && user.Email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setUsers(filteredUsers);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [searchTerm, allUsers, debounceDelay]);

  const handleFocus = async (): Promise<void> => {
    if (allUsers.length === 0) {
      await fetchAllUsers();
    }
  };

  const handleCheckboxChange = (user: ISiteUserInfo) => {
    if (multiSelect) {
      setSelectedUsers((prev) => {
        if (prev.some((u) => u.Id === user.Id)) {
          return prev.filter((u) => u.Id !== user.Id);
        }
        return [...prev, user];
      });
    } else {
      setSelectedUsers([user]);
    }
  };

  const removeSelectedUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.Id !== userId));
  };

  return (
    <div className="fps-people-picker">
      {/* Display selected users */}
      <div className="selected-users">
        {selectedUsers.map((user) => (
          <span key={user.Id} className="selected-user">
            <img src={user.imageUrl} alt={user.Title} className="user-image" />
            {user.Title}
            <button className="remove-user-btn" onClick={() => removeSelectedUser(user.Id)}>
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
        onFocus={handleFocus}
        placeholder="Search for a user..."
        className="search-input"
      />
      {loading && <p>{fetchingMessage}</p>}

      {/* User list */}
      <ul className="user-list">
        {!loading && !fetchingMessage && (typeToShow === false || searchTerm) && users.map((user) => (
          <li key={user.Id} className="user-item">
            <input
              type="checkbox"
              checked={selectedUsers.some((u) => u.Id === user.Id)}
              onChange={() => handleCheckboxChange(user)}
              className="user-checkbox"
            />
            <img src={user.imageUrl} alt={user.Title} className="user-image" />
            {user.Title} - {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharePointUserSearch;
