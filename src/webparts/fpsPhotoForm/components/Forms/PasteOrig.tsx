import * as React from 'react';
import { useState, FormEvent } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base'; // Import for SPFx context
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl'

// Constants for the list title
const ListTitle: string = 'PhotoFormMC';

export default function ScreenshotForm({ SiteUrl }: { SiteUrl: string }) {


  const [imageData, setImageData] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '' });

  // Handle pasting the image from the clipboard
  const handlePaste = (e: ClipboardEvent) => {
    const clipboardItems = e.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      if (clipboardItems[i].type.indexOf('image') !== -1) {
        const file = clipboardItems[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = function () {
          setImageData(reader.result as string); // Store the base64 image data
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Convert base64 to a File object
  const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
    const base64Prefix = 'data:image/png;base64,';
    if (base64.startsWith(base64Prefix)) {
      base64 = base64.slice(base64Prefix.length);
    }

    const base64String = base64.replace(/\s/g, '');

    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    const fileBlob = new Blob(byteArrays, { type: mimeType });
    return new File([fileBlob], filename, { type: mimeType });
  };

  // Create list item in SharePoint
  const createListItem = async (title: string): Promise<any> => {
    const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);
    const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-RequestDigest': requestDigest
      },
      body: JSON.stringify({
        Title: title
      })
    });

    const data = await response.json();
    return data;
  };

  // Upload image to SiteAssets library
  const uploadImageToLibrary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('Site Assets')/RootFolder/Files/add(url='${file.name}', overwrite=true)`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-RequestDigest': await getThisFPSDigestValueFromUrl(SiteUrl)
        },
        body: formData
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error uploading image:', errorDetails);
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload response data:', data);

      if (data && data.ServerRelativeUrl) {
        const imageUrl = data.ServerRelativeUrl;
        console.log('Image URL:', imageUrl);
        return imageUrl;
      } else {
        throw new Error('ServerRelativeUrl not found in the response');
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      return null;
    }
  };

  // Update list item with image URL
  const updateListItemWithImage = async (itemId: number, imageUrl: string) => {
    const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);
    const body = {
      ScreenshotUrl: imageUrl // Assuming ScreenshotUrl is the name of your image column
    };

    try {
      const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items(${itemId})`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-RequestDigest': requestDigest,
          'If-Match': '*'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error updating list item:', errorDetails);
        throw new Error('Failed to update list item');
      }

      if (response.status !== 204) {
        const updatedItem = await response.json();
        console.log('List item updated successfully:', updatedItem);
      } else {
        console.log('List item updated successfully, no content returned.');
      }
    } catch (error) {
      console.error('Error during list item update:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.title || !imageData) {
      alert('Please provide a title and paste an image');
      return;
    }


    const listItemResponse = await createListItem(formData.title);

    const filename = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;

    const file = base64ToFile(imageData, filename, 'image/png');

    const imageUrl = await uploadImageToLibrary(file);

    if (imageUrl) {
      await updateListItemWithImage(listItemResponse.Id, imageUrl);
      alert('Item created and image uploaded successfully!');
    } else {
      alert('Failed to upload the image.');
    }
  };

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste as any}>
      <div style={{ margin: '1em' }}>
        <h4>Expecting the following site structure</h4>
        <ul>
          <li>List with name:  { `'PhotoFormMC'`}</li>
          <li>Title column:  { `Comes with default list`}</li>
          <li>Text column called { `'ScreenshotUrl'`}</li>
          <li>SiteAssets library { `Titled as "Site Assets" with the space - should be default`} </li>
        </ul>
      </div>

      <div style={{ margin: '1em' }}>
        <label>Title</label>
        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
          style={{ paddingLeft: '.5em', marginLeft: '1em' }} />



      </div>
      <div style={{ margin: '1em' }}>
        <button type="submit">Submit</button>
      </div>

      {imageData && (
        <div>
          <h3>Pasted Image Preview:</h3>
          <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </form>
  );
}