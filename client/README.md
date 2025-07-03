# ReviQuiz | AIU

ReviQuiz | AIU is a quiz application designed for Alamein International University (AIU). This application allows users to take quizzes based on various faculties and difficulty levels, providing an engaging and educational experience.

## Features

- **Login/Welcome Page**: A welcoming interface with the app name and a button to start the quiz.
- **Home Page**: Displays the AIU logo, a hero section with a welcome message, and tabs for faculties and popular quizzes.
- **Faculty Selection Page**: Allows users to select a faculty and view available courses as clickable cards.
- **Difficulty Selection Page**: Presents three difficulty levels (Easy, Medium, Hard) for users to choose from.
- **Quiz Page**: Displays questions one by one with multiple choice answers, tracks scores, and provides visual feedback.
- **Results Page**: Shows the score summary, performance message, and options to retry or return home.


## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Router**: For navigation between different pages.
- **CSS**: For styling the application.
- **Axios**: For making HTTP requests to the backend API.

## Setup and Run

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    If you use npm:
    ```bash
    npm install
    ```
    If you use pnpm (as indicated by `pnpm-lock.yaml`):
    ```bash
    pnpm install
    ```
    If you use yarn:
    ```bash
    yarn install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    # or pnpm start / yarn start
    ```
    The application will typically open in your browser at `http://localhost:3000`.

## Key Learnings (Frontend)

Developing the ReviQuiz client application provided significant learning opportunities in frontend development:

- **Component-Based Architecture**: Building a modular UI using React components, managing their state and props effectively.
- **Client-Side Routing**: Implementing navigation within a single-page application (SPA) using React Router.
- **State Management**: Handling application state, including user input, API responses, and UI state. For more complex applications, this could be extended with tools like Redux or Zustand.
- **API Integration**: Communicating with a backend API (using Axios) to fetch data, submit forms, and handle responses, including error states.
- **User Interface (UI) Design**: Focusing on creating an intuitive and user-friendly interface, considering layout, navigation, and visual feedback.
- **Styling**: Applying CSS for styling components and ensuring a consistent look and feel. Explored basic CSS and potentially CSS frameworks or pre-processors if used.
- **Debugging**: Utilizing browser developer tools for inspecting elements, debugging JavaScript, and analyzing network requests.
- **Version Control (Git/GitHub)**: Collaborating on code, managing branches, and tracking changes.

## Future Improvements (Client-Side)

- **State Management Library**: For larger applications, integrate a dedicated state management library like Redux or Zustand for more predictable and maintainable state.
- **UI/UX Enhancements**:
    - Add loading indicators for API calls.
    - Implement more sophisticated form validation and user feedback.
    - Improve responsiveness for various screen sizes.
    - Animate page transitions or component interactions for a smoother feel.
- **Accessibility (a11y)**: Ensure the application is accessible by following WCAG guidelines (e.g., proper ARIA attributes, keyboard navigation).
- **Testing**: Write unit tests for components and utility functions using libraries like Jest and React Testing Library.
- **Code Splitting**: Optimize performance by splitting code into smaller chunks that are loaded on demand.
- **Theming**: Allow users to choose between light/dark themes.
- **Local Storage for Preferences**: Save user preferences (like difficulty) locally.