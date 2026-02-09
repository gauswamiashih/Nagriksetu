
# NagrikSetu - Civic Engagement Platform

NagrikSetu is a modern civic engagement platform designed to bridge the gap between citizens and local administration in the Banaskantha District. It empowers citizens to report issues, track their resolution status, and access essential government services, while providing administrators with tools to manage and resolve grievances efficiently.

## 🚀 Features

### For Citizens
- **Issue Reporting**: Easily report civic issues (e.g., potholes, sanitation) with location data and image evidence.
- **Status Tracking**: Track the real-time status of reported issues through a visual timeline.
- **Dashboard**: Personal dashboard to view history of reported issues and their outcomes.
- **Government Services**: Access information and links to various essential government services.
- **Multilingual Support**: (Future scope) Designed with accessibility in mind for diverse user bases.

### For Administrators
- **Admin Dashboard**: Comprehensive overview of all reported issues with filtering and sorting capabilities.
- **Issue Management**: Update status, assign reports to specific departments, and add official comments/resolutions.
- **Analytics**: (Future scope) Visual insights into common issues and resolution times.

## � Project Status

**Current Progress: 90% Completed**

- [x] **Authentication**: Secure Login, Registration, and Forgot Password flows.
- [x] **Citizen Dashboard**: View and track reported issues.
- [x] **Issue Reporting**: Comprehensive form with location and image upload.
- [x] **Admin Dashboard**: Manage, assign, and update issue statuses.
- [x] **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- [x] **Database**: Real-time data syncing with Supabase.
- [ ] **Multilingual Support**: Hindi/Gujarati translation (In Progress).
- [ ] **Advanced Analytics**: Charts and graphs for admin insights (Planned).

## 💻 Languages & Technologies

The project utilizes a modern, type-safe stack:

| Language/Tech | Usage |
| :--- | :--- |
| **TypeScript** | Core application logic (95%+) |
| **TSX (React)** | UI Components and Views |
| **CSS / Tailwind** | Styling and Layouts |
| **PostgreSQL** | Database (via Supabase) |
| **PowerShell** | Database setup scripts |


## �🛠️ Technology Stack

The project is built using a robust, modern tech stack ensuring performance, scalability, and developer experience.

- **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and build.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (built on Radix UI) for accessible and customizable components.
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query/latest) for server state management.
- **Routing**: [React Router](https://reactrouter.com/) for client-side routing.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation.
- **Backend & Database**: [Supabase](https://supabase.com/) for authentication, database (PostgreSQL), and storage.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Testing**: [Vitest](https://vitest.dev/) and React Testing Library.

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # Shadcn UI primitives
├── context/            # React Context providers (Auth, Theme)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Application pages (Home, Dashboard, Login, etc.)
├── services/           # API service layers
└── utils/              # Helper utility functions
```

## � Installation & Setup

Follow these steps to set up the project locally.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/gauswamiashih/nagriksetu.git
    cd nagriksetu
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

5.  **Build for Production**
    ```bash
    npm run build
    ```

## 🌐 Deployment

This project is configured for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the repository in Vercel.
3.  Vercel will automatically detect the Vite framework and deploy.
4.  Adding `vercel.json` ensures correct client-side routing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## � License

This project is licensed under the MIT License.
