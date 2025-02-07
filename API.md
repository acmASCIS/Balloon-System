# API Endpoint: Fetch Submissions  
**Endpoint:** `GET /submissions`  

## Query Parameters  
### Required Parameters  
- **`hall`** (`String`, Enum: `Fahmy`, `Tolba`) → Specifies the hall from which to fetch submissions.  

### Optional Parameters  
- **`new`** (`Boolean`, Default: `false`) → If `true`, fetches new submissions after `startFrom`. If `false`, fetches all contest submissions.  
- **`startFrom`** (`Integer`, Required if `new=true`) → The submission ID after which to fetch new submissions.  

## Behavior  
- If `new=false` (default): Returns **all contest submissions** from the specified hall.  
- If `new=true`:  
  - Requires `startFrom` to be specified.  
  - Returns **only new submissions** after `startFrom`.  

## Example Requests  
### Get all submissions from Hall Fahmy:  
```http
GET /submissions?new=false&hall=Fahmy
```  

### Get new submissions from Hall Fahmy after submission ID `12345`:  
```http
GET /submissions?new=true&startFrom=12345&hall=Fahmy
```  

### Get all submissions from Hall Saeed:  
```http
GET /submissions?new=false&hall=Saeed
```  

### Get new submissions from Hall Saeed after submission ID `12345`:  
```http
GET /submissions?new=true&startFrom=12345&hall=Saeed
```  

## Response Format  
```json
{
   "statusCode": 200,
   "message": "Success",
   "body": [
       {
           "id": 123,
           "handle": "mohanad",
           "problem_index": "A"
       },
       {
           "id": 124,
           "handle": "adham",
           "problem_index": "D2"
       }
   ]
}
```

## Response Schema  
- **`statusCode`** (`Integer`) → HTTP response status code.  
- **`message`** (`String`) → Descriptive message about the request status.  
- **`body`** (`Array<Submission>`) → List of accepted submissions. Each submission follows the schema below.  

### Submission Schema  
Each submission object in the `body` array contains:  
- **`id`** (`Integer`) → Submission ID
- **`handle`** (`String`) → Contestant's username.  
- **`problem_index`** (`String`) → Problem identifier.  

## Notes   
- If `new=false`, `startFrom` is ignored, and all submissions are returned.  

