# API Testing Guide

This guide shows how to test the POST endpoints for updating data in the Information, Education, and Entertainment tables.

## Endpoint: Update Information

**Endpoint:** `POST http://localhost:5000/info/:id`

Where `:id` is the database ID of the information item you want to update.

## Method 1: Using cURL

### Basic Update (Single Field)
```bash
curl -X POST http://localhost:5000/info/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Info Name",
    "description": "Updated description text"
  }'
```

### Update Multiple Fields
```bash
curl -X POST http://localhost:5000/info/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Info Name",
    "description": "Updated description",
    "company": "Updated Company Name",
    "technology": "React, TypeScript, Node.js",
    "productDescription": "Updated product description"
  }'
```

### Update All Fields
```bash
curl -X POST http://localhost:5000/info/1 \
  -H "Content-Type: application/json" \
  -d '{
    "media": "https://www.youtube.com/embed/NEW_VIDEO_ID",
    "index": "0",
    "image": "UpdatedImage01",
    "thumb": "../images/thumbnails/updated.jpg",
    "name": "Updated Info Name",
    "description": "Updated description",
    "company": "Updated Company Name",
    "productDescription": "Updated product description",
    "technology": "React, TypeScript, Node.js"
  }'
```

## Method 2: Using JavaScript Fetch

```javascript
// Update information item with ID 1
async function updateInformation() {
  const response = await fetch('http://localhost:5000/info/1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Updated Info Name',
      description: 'Updated description',
      company: 'Updated Company Name',
      technology: 'React, TypeScript, Node.js'
    })
  });

  const result = await response.json();
  console.log(result);
  // Expected response: { success: true, message: 'Information item updated successfully' }
}

updateInformation();
```

## Method 3: Using Postman/Insomnia

### Postman Setup:
1. **Method:** POST
2. **URL:** `http://localhost:5000/info/1`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:** Select "raw" and "JSON", then paste:
```json
{
  "name": "Updated Info Name",
  "description": "Updated description",
  "company": "Updated Company Name",
  "technology": "React, TypeScript, Node.js"
}
```

### Insomnia Setup:
1. **Method:** POST
2. **URL:** `http://localhost:5000/info/1`
3. **Body:** Select "JSON", then paste:
```json
{
  "name": "Updated Info Name",
  "description": "Updated description",
  "company": "Updated Company Name"
}
```

## Method 4: Using HTTPie

```bash
http POST http://localhost:5000/info/1 \
  name="Updated Info Name" \
  description="Updated description" \
  company="Updated Company Name" \
  technology="React, TypeScript, Node.js"
```

## Method 5: Using Axios (Node.js/TypeScript)

```typescript
import axios from 'axios';

async function updateInformation() {
  try {
    const response = await axios.post('http://localhost:5000/info/1', {
      name: 'Updated Info Name',
      description: 'Updated description',
      company: 'Updated Company Name',
      technology: 'React, TypeScript, Node.js'
    });

    console.log('Success:', response.data);
    // Expected: { success: true, message: 'Information item updated successfully' }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

updateInformation();
```

## Expected Responses

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Information item updated successfully"
}
```

### Error Responses

#### Item Not Found (404)
```json
{
  "statusCode": 404,
  "message": "Information item with id 1 not found",
  "error": "Not Found"
}
```

#### No Fields to Update (400)
```json
{
  "statusCode": 400,
  "message": "No fields to update",
  "error": "Bad Request"
}
```

#### Invalid ID Format (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

## Testing Steps

### Step 1: Get the ID of an item
First, get all information items to find an ID:
```bash
curl http://localhost:5000/info
```

Look for an item and note its database `id` (not the `index` field).

### Step 2: Update the item
Use one of the methods above with the ID you found.

### Step 3: Verify the update
Get the item again to verify it was updated:
```bash
curl http://localhost:5000/info
```

## Available Fields for Update

All fields are optional - you can update any combination:

- `media` - Media URL (YouTube embed, etc.)
- `index` - Index value (stored as `index_value` in DB)
- `image` - Image identifier
- `thumb` - Thumbnail path
- `name` - Project name
- `description` - Short description
- `company` - Company/client name
- `productDescription` - Detailed product description
- `technology` - Technologies used

## Testing Other Endpoints

### Update Education
```bash
curl -X POST http://localhost:5000/edu/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Education Name"}'
```

### Update Entertainment
```bash
curl -X POST http://localhost:5000/fun/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Entertainment Name"}'
```

## Example Test Script

Create a file `test-update.sh`:

```bash
#!/bin/bash

# Test updating information item
echo "Testing POST /info/1..."
curl -X POST http://localhost:5000/info/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Updated Name",
    "description": "Test updated description"
  }' | jq

echo -e "\n\nVerifying update..."
curl http://localhost:5000/info | jq '.[0]'
```

Make it executable and run:
```bash
chmod +x test-update.sh
./test-update.sh
```

