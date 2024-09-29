# API Documentation for Receive Data Endpoint

## Endpoint
```
POST /api/receive_data.php
```

## Description
This API endpoint is designed to receive JSON data from clients, validate the input, log the data, and return a success or error response.

## Request Format

### Headers
- **Content-Type**: `application/json`

### Body
The request body must be a JSON object containing the following required fields:

| Field       | Type     | Description                                   |
|-------------|----------|-----------------------------------------------|
| linkurl     | string   | The URL link associated with the event.      |
| eventType   | string   | The type of event being reported.            |
| data        | mixed    | Additional data related to the event.        |
| ip          | string   | The IP address of the client making the request. |
| timestamp   | string   | The timestamp of the event in ISO 8601 format. |

### Example Request
```json
{
    "linkurl": "https://example.com",
    "eventType": "click",
    "data": {
        "userId": "12345",
        "action": "download"
    },
    "ip": "192.168.1.1",
    "timestamp": "2023-10-01T12:00:00Z"
}
```

## Response Format

### Success Response
- **Status Code**: `200 OK`
- **Content-Type**: `application/json`

#### Body
On success, the response will be a JSON object with the following structure:
```json
{
    "status": "success",
    "message": "Data received successfully"
}
```

### Error Responses
- **Status Code**: `400 Bad Request`
- **Content-Type**: `application/json`

#### Body
In case of an error, the response will be a JSON object with the following structure:
```json
{
    "status": "error",
    "message": "Error message here"
}
```

#### Possible Error Messages
1. **Invalid JSON**: If the JSON cannot be parsed.
   ```json
   {
       "status": "error",
       "message": "Invalid JSON"
   }
   ```
2. **Missing Field**: If any of the required fields are missing.
   ```json
   {
       "status": "error",
       "message": "Missing field: linkurl"
   }
   ```

## Usage Example
### Request
```bash
curl -X POST http://yourdomain.com/api/receive_data.php \
-H "Content-Type: application/json" \
-d '{
    "linkurl": "https://example.com",
    "eventType": "click",
    "data": {
        "userId": "12345",
        "action": "download"
    },
    "ip": "192.168.1.1",
    "timestamp": "2023-10-01T12:00:00Z"
}'
```

### Response
```json
{
    "status": "success",
    "message": "Data received successfully"
}
```

## Notes
- Ensure that the server has write permissions to the log file located at `/var/www/roundcubemail/logs/js_event.log`.
- The timestamp should be in ISO 8601 format to ensure proper logging and processing.