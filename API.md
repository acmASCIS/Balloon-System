# API Endpoint: Fetch Submissions  
**Endpoint:** `GET /submissions`  

## Query Parameters  
### Required Parameters  
- **`location`** (`String`, Enum: `Fahmy`, `Saeed`) → Specifies the physical contest location (lab/hall) from which to fetch submissions.  

### Optional Parameters  
- **`new`** (`Boolean`, Default: `false`) → If `true`, fetches new submissions after refresh or page initialization. If `false`, fetches all contest submissions.  

## Behavior  
- If `new=false` (default): Returns **all contest accepted submissions** from the specified location.  
- If `new=true`: Returns **all NEW contest accepted submissions** from the specified location (i.e., submissions retrieved after hitting refresh or page initialization).  

## Example Requests  
### Get all submissions from Hall Fahmy:  
```http
GET /submissions?new=false&location=Fahmy
```  

### Get new submissions from Hall Fahmy:  
```http
GET /submissions?new=true&location=Fahmy
```  

### Get all submissions from Hall Saeed:  
```http
GET /submissions?new=false&location=Saeed
```  

### Get new submissions from Hall Saeed:  
```http
GET /submissions?new=true&location=Saeed
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
           "problem_index": "A",
           "seat": "1, 3",
           "delivered": false
       },
       {
           "id": 124,
           "handle": "adham",
           "problem_index": "D2",
           "seat": "1, 2",
           "delivered": true
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
- **`id`** (`Integer`) → Submission ID.  
- **`handle`** (`String`) → Contestant's username.  
- **`problem_index`** (`String`) → Problem identifier.  
- **`seat`** (`String`) → Physical seat in location (e.g., seat in Fahmy).  
- **`delivered`** (`Boolean`) → The accepted submission's balloon status.  

