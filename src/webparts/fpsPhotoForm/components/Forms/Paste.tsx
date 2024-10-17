import * as React from 'react';
import { FormEvent } from 'react';
import { useState } from 'react';

const SiteUrl: string = 'https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart';
const ListTitle: string = 'PhotoFormMC';

import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl'

export default function ScreenshotForm() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '' });

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
        Title: title // You can add other fields here
      })
    });

    return await response.json();
  };

  const updateListItemWithImage = async (itemId: number, imageData: string) => {
    const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);

    // Log the base64 image data before sending it
    console.log('Updating image data with base64:', imageData);

    const body = {
      Screenshot: imageData // Directly pass base64 image data as a string
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
        const errorDetails = await response.json();
        console.error('Error updating list item with image:', errorDetails);
      }
    } catch (error) {
      console.error('Network error while updating list item:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.title || !imageData) {
      alert('Please provide a title and paste an image');
      return;
    }

    // Step 1: Create the list item
    const listItemResponse = await createListItem(formData.title);

    // Step 2: Update the list item with the image in the Screenshot column (Image column)
    await updateListItemWithImage(listItemResponse.Id, imageData);

    alert('Item created successfully with image!');
  };

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste as any}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
      {imageData && (
        <div>
          <h3>Preview of Pasted Image:</h3>
          <img src={imageData} alt="Pasted preview" style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '10px' }} />
        </div>
      )}
    </form>
  );
}
