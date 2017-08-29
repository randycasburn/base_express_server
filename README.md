# Base Express Server

NodeJS + Express with basic authentication. Designed to host one statically served site and one RESTful site. 

This provides a reasonable server platform that mimics two authentication schemes on a single Express server.

1. Classic session based authentication provides authentication for static sites (SPAs);
- Pass username and password as a POST to /login using Content Type: application/json
- GET /logout to logout and remove the session

2. Bearer Token based API access that mimics and API Key authentication scheme
- Complexity is reduced by creating a Bearer token at login and passing it back to the client
- Client must set Authorization: Bearer <token> in order to access the API resources

TODO: timout the sessions.
