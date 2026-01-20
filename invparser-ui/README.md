# invparser-ui/README.md

# Invoice Parser Frontend

This project is a modern Invoice Parser frontend built with Next.js, TypeScript, and Tailwind CSS. It provides a clean SaaS admin dashboard interface for managing invoices, including features for uploading, viewing, and editing invoice data.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix) + **lucide-react** icons
- **TanStack React Query** (optional for data fetching)

## Features

- User authentication with a login page
- Dashboard displaying user statistics and recent invoices
- Upload functionality for invoice files
- Invoices management with filtering, sorting, and pagination
- Detailed invoice view with editable fields
- Responsive design with a modern UI

## Project Structure

```
invparser-ui
├── app
│   ├── (auth)
│   │   └── login
│   │       └── page.tsx
│   ├── (protected)
│   │   ├── layout.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── upload
│   │   │   └── page.tsx
│   │   ├── invoices
│   │   │   └── page.tsx
│   │   └── invoice
│   │       └── [id]
│   │           └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── StatCard.tsx
│   ├── InvoiceTable.tsx
│   ├── UploadDropzone.tsx
│   ├── QuickActions.tsx
│   ├── LoadingSkeleton.tsx
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── toast.tsx
├── lib
│   ├── api.ts
│   ├── auth.ts
│   ├── types.ts
│   └── utils.ts
├── hooks
│   └── useAuth.ts
├── public
│   └── placeholder.svg
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd invparser-ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Navigate to `/login` to authenticate.
- After logging in, you will be redirected to the `/dashboard`.
- Use the `/upload` page to upload invoice files.
- View and manage invoices on the `/invoices` page.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.