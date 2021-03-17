# Day Tripper API

## Endpoints

### Get
To display all trips in the trips database:

`fetch('https://floating-lowlands-20964.herokuapp.com/api/trips', 
     {method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})`

### Get by Trip ID
To display a specific trip from the trips database:

`fetch('https://floating-lowlands-20964.herokuapp.com/api/trips/${YourTripId}', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})`

### Post
To save a new trip to the trips database:

`fetch('https://floating-lowlands-20964.herokuapp.com/api/trips', {
      method: 'POST',
      body: JSON.stringify(newTrip),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})`

Example of 'newTrip' object:

`const newTrip = {
            id: 1 (required),
            name: 'New Trip' (required),
            location: 'Anywhere, USA' (required),
            notes: 'Test Notes' (optional),
            rating: 3 (required),
            }`

### Delete
To delete an existing trip from the trips database:

`fetch('https://floating-lowlands-20964.herokuapp.com/api/trips/${YourTripId}', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer REACT_APP_API_KEY'
        }})`

### Patch
To update an exisiting trip in the trips database:

`fetch('https://floating-lowlands-20964.herokuapp.com/api/trips/${YourTripId}', {
      method: 'PATCH',
      body: JSON.stringify(updatedTrip),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer REACT_APP_API_KEY'
      }})`

Example of 'updatedTrip' object:

`const updatedTrip = {
            id: 1 (required),
            name: 'Updated Trip' (required),
            location: 'Anywhere, USA' (required),
            notes: 'Updated Notes' (optional),
            rating: 3 (required),
            }`
