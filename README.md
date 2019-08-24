# AuthenticationServerGPSChat
A simple Authentication server that is used by the application named GPSChat for Android

## Usage
To use it, simply redirect yourself to `https://gpschatauthenticator.herokuapp.com` and make a POST request with
- `Content-Type: application/json`
- `path: /auth`
- `body: {"usr": <valid username>, "pwd": <valid password>}`
