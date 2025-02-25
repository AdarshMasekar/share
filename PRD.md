**Product Requirements Document (PRD): Simple Zip Upload/Download Website (No Authentication)**

**1. Introduction**

*   **1.1. Purpose:** This document outlines the requirements for a very basic website that allows users to upload ZIP files and download them freely. There is NO user authentication or authorization.
*   **1.2. Goals:**
    *   Provide an *extremely* simple interface for uploading and downloading ZIP files.
    *   Store uploaded files in a MongoDB database using the GridFS specification using mongoose as an odm.
    *   Enable easy deployment of both frontend and backend to Vercel.
    *   Minimize complexity, focusing solely on file management.
    *   **Explicit Warning: This application is inherently insecure. Anyone with the URL can upload and download files.**
*   **1.3. Target Audience:** Users who need a *temporary* and *publicly accessible* place to share ZIP files, understanding the security implications.

**2. Overall Description**

*   **2.1. Product Perspective:** A standalone web application, with a React.js frontend and Node.js/Express.js backend.
*   **2.2. Product Functions:**
    *   **Upload ZIP File:** Upload a ZIP file from the user's computer.
    *   **File Listing:** Display a list of all uploaded ZIP files (name, timestamp).
    *   **Download ZIP File:** Download a specific ZIP file.
    *   **REST API:** Expose API endpoints for upload, listing, and download.
*   **2.3. User Characteristics:** Basic web literacy.
*   **2.4. Operating Environment:** Modern web browser, deployed on Vercel (Node.js runtime).
*   **2.5. Design and Implementation Constraints:**
    *   **Extremely Simple:** Minimal UI, very little styling.
    *   **Vercel Compatibility:**  Deployable to Vercel without modification.
    *   **NO Authentication:** No login, no user accounts.  *Anyone* can upload and download.
    *   **Security Awareness:** **Explicitly document that this application is not secure and should not be used for sensitive data.**
*   **2.6. Assumptions and Dependencies:**
    *   Internet connection.
    *   MongoDB Atlas account.
    *   Vercel account.

**3. Specific Requirements**

*   **3.1. Frontend (React.js):**
    *   **File Upload UI:**  `<input type="file">`, "Upload" button, progress indicator if possible.
    *   **File List UI:** List of filenames and upload dates, "Download" links. NO pagination.
    *   **API Calls:** `fetch` or `axios` for interacting with the backend.
    *   Minimal Styling (e.g., basic CSS).
*   **3.2. Backend (Node.js/Express.js):**
    *   **API Endpoints:**
        *   `POST /api/upload`: Accepts ZIP file.
        *   `GET /api/files`: Returns list of files.
        *   `GET /api/files/:filename`: Returns a file for download.
    *   **File Storage (MongoDB GridFS):** Using mongoose odm.
    *   **NO AUTHENTICATION.**
    *   CORS middleware to allow frontend requests.
    *   `multer` for file uploads.
*   **3.3. Database (MongoDB Atlas):**
    *   Store file metadata (filename, timestamp) and content in GridFS.
*   **3.4. Deployment (Vercel):**
    *   `vercel.json` configuration.
    *   Environment variables (database connection string).

**4. Functional Requirements**

*   **4.1. Upload:**
    *   Upload ZIP files (size limit: e.g., 50MB).
    *   Validate that file is a ZIP file.
    *   Display error message if upload fails or file invalid.
*   **4.2. File Listing:**
    *   List all uploaded files with filename and upload time, simple unordered List format.
    *   No sorting, no pagination.
*   **4.3. Download:**
    *   Direct download link for each file.
    * handle concurrent download requests efficiently.

**5. Non-Functional Requirements**

*   **5.1. Performance:** Fast loading and reasonable upload/download speeds.
*   **5.2. Security:** MINIMAL. Relying only on infrastructure security of Vercel and MongoDB. **WARNING: The application itself provides NO SECURITY.**
*   **5.3. Usability:** Extremely simple and easy to use. minimal Ui / ux
*   **5.4. Reliability:** Reasonably reliable file upload and download.
*   **5.5. Scalability:**  Not a primary concern, but should handle a few concurrent users.
*   **5.6. Maintainability:** Clean and simple code.
*   **5.7. Testability:** Simple testing to confirm functionality. Ensure unit and integration tests are implemented to prevent regressions.

**6. Release Criteria**

*   All functional requirements are met.
*   The system is deployed to Vercel.
*   A large warning about the lack of security is prominently displayed in the UI and in the code's `README.md`.

**7. Future Considerations**

*   NONE.  This is intended to be a very simple application.

**8. Mockups/Wireframes**

*   (Rough Sketches - VERY BASIC)

    *   **Upload Page:**
        *   Title: "ZIP File Uploader"
        *   File Input: "Choose File" Button
        *   Upload Button: "Upload"
        *   List of Uploaded Files (initially empty)
    *   **File List:** Display file name and download button in bullet form

**Key Considerations for Cursor:**

*   **Security Warning:** Make sure Cursor generates a prominent and persistent warning message, both in the UI and in the README, about the lack of security.
*   **`vercel.json`:** Correctly configured for routing and build process.
*   **CORS:** CORS MUST be properly configured in the backend.

This revised PRD focuses only on the core file upload/download functionality, with no authentication, and a strong emphasis on the inherent insecurity of the application. Remember to guide Cursor to prioritize the security warning.
