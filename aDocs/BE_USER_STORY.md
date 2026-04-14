
# User Story: Create a NestJS API for Data Consumption

**As a** developer,
**I want** to create a robust and scalable API using the NestJS framework,
**so that** I can decouple the data layer from the frontend, improve maintainability, and ensure a consistent and scalable data source for the entire application.

## Acceptance Criteria:

1.  **API Endpoint:** An API endpoint is created using NestJS to serve project data.
2.  **Data Source:** The API fetches data from the existing JSON files (`info.json`, `edu.json`, `fun.json`).
3.  **Dynamic Data:** The API can dynamically serve data based on a parameter (e.g., `/api/projects?type=info`).
4.  **JSON Format:** The API returns data in JSON format with the correct `Content-Type` header.
5.  **Error Handling:** The API includes basic error handling for invalid requests or missing data.
6.  **Scalability:** The architecture allows for future expansion, such as connecting to a database, without requiring significant changes to the frontend.
