# Rectangle Resizer

This project is a webpage for drawing and resizing a rectangle SVG figure. It displays the perimeter of the figure and allows the user to resize the figure by mouse. The initial dimensions of the SVG figure are taken from a JSON file, and after resizing, the system updates the JSON file with the new dimensions. The rectangle dimensions are validated at the backend level.

## Requirements

- The initial dimensions of the SVG figure need to be taken from a JSON file.
- The user should be able to resize the figure by mouse.
- The perimeter of the figure needs to be displayed.
- After resizing, the system must update the JSON file with new dimensions.
- When resizing the rectangle finishes, it should be validated at the backend level. If the rectangle width exceeds the height, it should send back an error to the UI. The duration of validation in the backend should be artificially increased to 10 seconds to imitate long-lasting calculations.
- The user can resize the rectangle while the previous validation is still not completed.

## Technologies Used

- React (frontend)
- C# (backend for JSON handling and saving through API)
- Axios (for API requests)
- @testing-library/react and jest (for testing)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/rectangle-resizer.git
   cd rectangle-resizer
   ```

2. Install frontend dependencies:

   ```sh
   cd rectangle-resizer
   npm install
   ```

3. Install backend dependencies:
   ```sh
   cd ../backend
   dotnet restore
   ```

## Running the Application

1. Start the backend server:

   ```sh
   cd backend
   dotnet run
   ```

2. Start the frontend development server:

   ```sh
   cd ../rectangle-resizer
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to see the application.

## Running Tests

1. Run frontend tests:

   ```sh
   cd rectangle-resizer
   npm test
   ```

2. Run backend tests:
   ```sh
   cd ../backend
   dotnet test
   ```

## API Endpoints

- `GET /api/rectangle`: Fetch the initial dimensions of the rectangle.
- `POST /api/rectangle/validate`: Validate the dimensions of the rectangle.
- `POST /api/rectangle/update`: Update the dimensions of the rectangle.

## Note

The ports for the .NET API and the React application might be different on your machine. If you encounter issues with API calls or accessing the React application, you may need to update the URLs to match the ports used by your .NET API and React application. For example:

For the .NET API:

```tsx
await axios.post("https://localhost:7221/api/rectangle/update", dimensions);
```

For the React application:

```sh
http://localhost:3000
```

## Job Interview Task

This project was created as part of a job interview task to demonstrate proficiency in React, C#, and API integration.

## Tests

Automated tests were written for this project to ensure the functionality of the components and API interactions. The tests cover rendering, user interactions, and API calls.
