# Scan2Pay User Portal (gbknew)

The Scan2Pay User Portal is a React-based web application designed for end-users to perform currency swaps (INR ↔ USDC/USDT) and manage their transactions. It serves as the primary interface for customers using the Scan2Pay service.

## Features

-   **User Login:** Secure authentication via Google, GitHub, LinkedIn, Facebook, Email OTP, and Phone OTP.
-   **Currency Swap:** Instant swapping between INR and USDC/USDT.
-   **Dashboard:** User-friendly dashboard to view balances and transaction history.
-   **PWA Support:** Progressive Web App capabilities for mobile-like experience.
-   **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack

-   **Frontend Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation.
-   **UI Components:** Custom components inspired by [Shadcn UI](https://ui.shadcn.com/).

## Prerequisites

Ensure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

1.  **Navigate to the project directory:**

    ```bash
    cd gbknew
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/users/` (or the port specified in your terminal).

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

-   `src/components`: Reusable UI components and feature-specific modules.
-   `src/hooks`: Custom React hooks.
-   `src/screens`: Main page components.
-   `src/store`: Redux store configuration and slices.
-   `src/lib`: Utility functions.
-   `public`: Static assets.
