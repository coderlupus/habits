
# Habit Tracker Application Blueprint

## Overview

A simple yet beautiful habit tracking application designed to help users build and maintain positive daily habits. The application provides a clean and intuitive interface for users to manage their goals, track their progress, and stay motivated.

## Features Implemented

*   **User Authentication:** Secure sign-up and login functionality using Firebase Authentication.
*   **Habit Management:**
    *   **Create:** Users can add new habits with a custom name and a daily goal.
    *   **Track:** Progress for each habit can be tracked with a single click.
    *   **Delete:** Habits can be easily removed.
    *   **Edit:** Existing habits can be modified.
    *   **Search:** Users can search through their personal list of habits.
*   **API & Data Fetching:**
    *   **SSG (Static Site Generation):** The "Recommended for You" section is pre-rendered at build time for optimal performance.
    *   **API Route:** A dedicated API route (`/api/habits`) is implemented to fetch user-specific habits from the Firestore database.
*   **Modern UI/UX:**
    *   Built with **Next.js** and styled with **Tailwind CSS**.
    *   Utilizes the **shadcn/ui** component library for a polished and consistent look.
    *   **Dynamic Icons:** Visual cues for different habits (e.g., water, walking) to make the interface more intuitive.
    *   **Daily Progress Summary:** A circular progress bar provides an at-a-glance view of the user's daily achievements.
    *   **Enhanced User Feedback:** Toast notifications provide immediate confirmation when a user adds, completes, or deletes a habit.
    *   **Improved Empty State:** A more engaging and visually appealing empty state on the main dashboard to welcome new users.

## Development Plan

### Current Task: Dynamic Habit Detail Pages

Implement dynamic routing to provide a detailed view for each habit. This will fulfill the "Rotas Dinâmicas" requirement.

**Plan:**

1.  **Create Dynamic Route:** Set up the file structure `src/app/habits/[id]/page.jsx`.
2.  **Fetch Single Habit:** Create a new function `getHabit(habitId)` in `src/lib/firestore.js` to retrieve a specific habit from the database.
3.  **Build Detail Page:**
    *   The page will be a Server Component to fetch data server-side.
    *   It will display the habit's name and goal.
    *   It will feature a calendar view (`react-calendar`) to visualize the days the habit was completed.
4.  **Enable Navigation:** Update the habit cards on the main page to link to their respective detail pages.

### Completed Steps

*   **SSG & API Refactor:** The application was refactored to use Static Site Generation (SSG) for the initial list of recommended habits. The API route (`/api/habits`) was repurposed to handle dynamic data fetching from Firestore, making it a robust backend endpoint.
*   **Client-Side Search:** Implemented a search feature for the user's personal habits, with filtering logic handled efficiently on the client side.
*   **Firebase Integration Fix:** Corrected the Firebase configuration and standardized all import paths.
*   **Global Authentication State:** Implemented a global `AuthProvider`.
*   **Enhanced User Feedback:** Implemented toast notifications.
*   **Habit Editing:** Added functionality for users to edit existing habits.
*   **UI/UX Refinements:** Improved the "empty state" on the main dashboard.

### Future Improvements

*   **Server Actions:** Refactor the form submissions (add/edit habit) to use Server Actions for a more modern and streamlined approach.
*   **Habit Streaks:** Introduce a system to track and display habit streaks to further motivate users.
*   **UI Streaming:** Implement UI Streaming on pages with slower data loads to improve perceived performance.
*   **Theming:** Add support for light and dark modes.
