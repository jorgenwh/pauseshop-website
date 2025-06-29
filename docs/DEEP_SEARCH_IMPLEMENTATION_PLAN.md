# Deep Search Implementation Plan

This document outlines the plan to implement the "Deep Search" ranking feature on the referrer page.

## 1. Overview

The goal is to add a feature that allows users to trigger an AI-powered ranking of product thumbnails based on their visual similarity to the original screenshot. This will involve frontend changes to gather the necessary data, call the backend ranking endpoint, and display the streaming results.

## 2. Core Requirements

-   **Trigger**: A "Deep Search" button on the referrer page.
-   **Data Payload**: The feature must construct a `RankingRequest` payload for the `/api/analyze/rank-products` endpoint.
-   **Image Handling**: The implementation must handle converting image URLs to base64 and implement a session-first, fallback strategy for the original image.
-   **Thumbnail IDs**: Generate simple numeric IDs for thumbnails to optimize token usage.
-   **UI**: Display the streaming ranking results in a clear and intuitive way.

## 3. Revised Implementation Plan

### Phase 1: Backend API Modification (Conceptual)

-   **Update `/analyze/rank-products` Endpoint**:
    -   Modify the `RankingRequest` interface to make `originalImage` optional and add an optional `pauseId`.
    -   **Backend Logic**:
        -   If `pauseId` is present, the server will attempt to load the original image from the corresponding session.
        -   If the session is expired or does not contain the image, the server will return a specific error (e.g., `SESSION_IMAGE_UNAVAILABLE`).
        -   If `originalImage` is present in the payload (the fallback), the server will use it directly.

### Phase 2: Frontend Data & API Layer

1.  **Generate Thumbnail IDs**:
    -   The `decodeReferrerData` function in `src/lib/referrer.ts` will be modified. As it parses the Amazon products, it will assign a simple, sequential numeric ID (e.g., "1", "2", "3"...) to each thumbnail. This ID will be used for the `rankings` request.

2.  **Update `rankProductsStreaming` API Function**:
    -   The function in `src/lib/api.ts` will be enhanced to handle the new session-first logic.
    -   It will accept a `RankingRequest` and manage the communication and error handling with the backend, including the fallback mechanism.

### Phase 3: `ReferrerPage.tsx` Logic

1.  **Implement `handleDeepSearch` with Fallback**:
    -   The `handleDeepSearch` function in `src/pages/ReferrerPage.tsx` will orchestrate the new flow:
        1.  **Initial Attempt (Session First)**:
            -   Convert only the thumbnail URLs to base64.
            -   Construct a `RankingRequest` containing the `productName`, `pauseId`, and the base64 `thumbnails` with their new numeric IDs.
            -   Call `rankProductsStreaming` with this request.
        2.  **Fallback (Client-side Upload)**:
            -   If the API call returns the `SESSION_IMAGE_UNAVAILABLE` error, the function will then proceed to convert the `originalImage` URL to base64.
            -   It will then construct a new `RankingRequest`, this time including the `originalImage` but omitting the `pauseId`.
            -   It will call `rankProductsStreaming` again with this fallback request.
        3.  **UI State**: The UI will show a continuous loading state to the user throughout this process.

## 4. UI/UX

-   A "Deep Search" button will be added to the `ReferrerPage`.
-   A new `RankingResults` component will be created to display the streaming results, including rank, thumbnail, and similarity score.
-   Loading and error states will be clearly communicated to the user.

## 5. Workflow Diagram

```mermaid
graph TD
    subgraph ReferrerPage.tsx
        A[Page Load] --> B{Get pauseId & data};
        B --> C[getScreenshot(pauseId) --> Set imageUrl];
        B --> D[decodeReferrerData(data)];
        D --> D1[Generate numeric IDs for thumbnails];

        G[User Clicks "Deep Search"] --> H{handleDeepSearch};
        H --> I[Show Loading State];
        H --> J[Convert Thumbnail URLs to Base64];
        J --> K[Construct Request (with pauseId, no originalImage)];
        K --> L[api.rankProductsStreaming(request)];
    end

    subgraph "API Layer"
        L --> M[POST /api/analyze/rank-products];
    end

    subgraph "Backend"
        M --> N{Session image available?};
        N -- Yes --> O[Use session image --> Streaming Response];
        N -- No --> P[Return SESSION_IMAGE_UNAVAILABLE error];
    end

    subgraph "API Layer"
        O --> S[Forward Streaming Response];
        P --> Q[Forward Error to Caller];
    end

    subgraph "ReferrerPage.tsx"
        S -- onRanking --> T[Update rankingResults State];
        S -- onComplete --> U[Set isRanking = false];
        Q --> R{Error is SESSION_IMAGE_UNAVAILABLE?};
        R -- Yes --> V[Convert originalImage URL to Base64];
        V --> W[Construct Fallback Request (with originalImage)];
        W --> X[api.rankProductsStreaming(fallbackRequest)];
        R -- No --> Y[Set rankingError State];
    end

    subgraph "RankingResults.tsx"
        T --> Z[Render updated list of ranked products];
    end

    style G fill:#87CEEB,stroke:#333,stroke-width:2px