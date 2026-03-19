# LoopLearn — Project Blackbook

> **Project Title**: LoopLearn – AI-Assisted Daily Technical Briefing Platform  
> **Prepared By**: Pradnyesh Bhalekar  
> **Date**: March 2026

---

## Table of Contents

1. [Chapter 1: Introduction](#chapter-1-introduction)
2. [Chapter 2: Literature Survey](#chapter-2-literature-survey)
3. [Chapter 3: Methodology](#chapter-3-methodology)
4. [Chapter 4: Implementation](#chapter-4-implementation)
5. [Chapter 5: Analysis & Related Work](#chapter-5-analysis--related-work)
6. [Chapter 6: Conclusion & Future Work](#chapter-6-conclusion--future-work)

---

# Chapter 1: Introduction

## 1.1 Introduction

The modern software engineering landscape presents a significant challenge: **information overload**. Engineers are surrounded by an ever-growing volume of tutorials, blog posts, newsletters, and social media content. Most of these platforms are primarily designed for engagement and long-form consumption, rather than structured knowledge retention. Research in cognitive science suggests that passive consumption of technical content leads to poor long-term recall without active reinforcement mechanisms.

**LoopLearn** addresses this gap by delivering **one structured technical briefing per day** across a dynamically expandable set of engineering domains. The system uses AI to structure and compile content from web sources, generate architectural diagrams, and synthesize audio narrations. It is not an AI content generator in the traditional sense — it uses AI as a structuring and compilation tool to transform scraped web content into a standardized, high-fidelity learning format.

The platform follows a **"Close the Loop"** methodology — read, visualize, implement — designed to maximize retention through structured, daily exposure to a single concept.

## 1.2 Description

LoopLearn is a full-stack web application consisting of two primary components:

- **Backend (Python/Flask)**: A REST API managing a knowledge graph of engineering concepts, an autonomous content structuring pipeline, user authentication (Google OAuth), subscription management (Razorpay), workspace collaboration, and email notifications. Two GitHub Actions cron jobs automate daily content generation.
- **Frontend (React/TypeScript)**: A single-page application built with Vite, featuring premium dark/light theming, Framer Motion animations, an in-context AI Tutor, a Commuter Mode audio player, and a responsive mobile-optimized interface.

Supporting infrastructure includes PostgreSQL (Neon) for data persistence, Cloudinary for audio storage, and a graph-based data model for intelligent, non-repetitive topic selection.

## 1.3 Stakeholders

| Stakeholder | Role | Interest |
|---|---|---|
| **Free Users** | Public visitors | Access one random daily article (public audience) across any domain |
| **Subscribers** | Paying users | Access domain-specific premium articles, Commuter Mode audio, and the AI Tutor |
| **Team Admins** | Software developers / leads | Purchase team subscriptions at a reduced per-seat cost; invite junior developers or colleagues to their workspace |
| **Platform Admin** | Content moderator | Review AI-generated candidate articles (approve/reject); optionally trigger pipeline runs manually |
| **Platform Owner** | Business stakeholder | Revenue generation via individual and team subscription plans through Razorpay |

---

# Chapter 2: Literature Survey

## 2.1 Description of Existing System

Several platforms currently serve the continuous engineering education space, each with a distinct approach:

| Platform | Model | Approach |
|---|---|---|
| **YouTube / Udemy** | Long-form video courses | Primarily designed for engagement and long-form consumption. Users must commit significant time per session. |
| **Medium / Dev.to** | User-generated blog posts | Content quality varies significantly. No structured learning path or spaced repetition. Users must self-curate. |
| **Daily.dev / TLDR Newsletter** | Aggregated links and summaries | Provides breadth of coverage through link aggregation, but individual articles are shallow summaries pointing to external sources. |
| **LeetCode / HackerRank** | Problem-solving practice | Focused on data structures and algorithm interview preparation. Does not address system design, architecture, or infrastructure knowledge. |
| **O'Reilly / Manning** | Technical books and references | High-quality static content, but requires long-term commitment. Not structured for daily habit formation. |

## 2.2 Limitations of Present System

1. **Volume Over Depth**: Existing platforms deliver high volumes of content, but do not provide structured, deep-dive coverage of individual topics within a constrained daily time commitment.

2. **Manual Topic Selection**: Users are required to manually discover and select what to learn. No existing platform maintains a knowledge graph that tracks coverage across engineering domains and prevents repetition.

3. **Absence of Architectural Visualization**: Most text-based platforms do not provide auto-generated architectural diagrams. Engineers building mental models of distributed systems benefit significantly from spatial representations.

4. **Limited Audio Support**: Engineers commuting or exercising lack access to structured technical content in audio form that maintains the same fidelity as written material.

5. **No Team Learning Infrastructure**: There is no widely adopted platform that allows engineering leads to provision structured daily learning across their entire team, with shared subscriptions and workspace management.

6. **Passive Consumption Model**: Content is consumed passively. Few platforms incorporate active recall mechanisms such as flashcards, trade-off comparison tables, or structured case studies within the same learning session.

---

# Chapter 3: Methodology

## 3.1 Gantt Chart (Timeline)

```mermaid
gantt
    title LoopLearn Development Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Backend
    Flask API Setup and DB Schema        :done, b1, 2026-01-15, 7d
    Knowledge Graph Model                :done, b2, after b1, 5d
    Topic Picker Algorithm               :done, b3, after b2, 4d
    Web Scraper and Source Fetcher        :done, b4, after b3, 5d
    Gemini AI Compilation Pipeline        :done, b5, after b4, 7d
    Audio Synthesis with Edge TTS         :done, b6, after b5, 4d
    Auth with Google OAuth and JWT        :done, b7, after b5, 3d
    Subscription and Razorpay            :done, b8, after b7, 5d
    Workspace and Team Features          :done, b9, after b8, 4d
    AI Tutor Explain Service             :done, b10, after b9, 3d
    Email Notifications with Resend      :done, b11, after b10, 2d

    section Frontend
    Vite React Tailwind Setup            :done, f1, 2026-02-10, 3d
    Home Page and Animations             :done, f2, after f1, 5d
    Login Page Google OAuth              :done, f3, after f2, 2d
    Dashboard Page                       :done, f4, after f3, 5d
    Article Reader with Mermaid          :done, f5, after f4, 5d
    Commuter Mode Audio Player           :done, f6, after f5, 3d
    AI Tutor Text Selection              :done, f7, after f6, 4d
    Pricing and Subscription Flow        :done, f8, after f7, 4d
    Admin Panel                          :done, f9, after f8, 4d
    Workspace Management UI              :done, f10, after f9, 3d
    Mobile Optimization                  :done, f11, after f10, 2d

    section Deployment and CI/CD
    Backend on Render                    :done, d1, 2026-01-22, 1d
    Frontend on Vercel                   :done, d2, 2026-02-13, 1d
    GitHub Actions Free Cron             :done, d3, 2026-02-28, 2d
    GitHub Actions Premium Cron          :done, d4, after d3, 2d
    Continuous Testing and Bug Fixes     :active, d5, 2026-03-10, 14d
```

> **Note**: Both backend (Render) and frontend (Vercel) were deployed early in the development cycle and updated continuously throughout. The Gantt chart reflects initial deployment dates with ongoing iteration.

## 3.2 Technologies Used and their Description

### 3.2.1 Backend Stack

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **Python** | 3.12+ | Core backend language | Extensive AI/ML ecosystem; strong library support for web scraping and API development |
| **Flask** | 3.1.2 | REST API framework | Lightweight and modular; avoids the overhead of full-stack frameworks like Django for an API-only backend |
| **PostgreSQL (Neon)** | 16 | Cloud-hosted relational database | ACID compliance for subscription data; JSONB support for flexible content storage; serverless scaling via Neon |
| **psycopg2** | 2.9.11 | PostgreSQL adapter | Industry-standard Python PostgreSQL driver with connection pooling support |
| **Google Gemini** (genai SDK) | 2.5 Flash | AI content structuring | High throughput, structured JSON output mode, cost-effective for batch content compilation |
| **GPT-4o-mini** (GitHub Models) | — | AI Tutor explanations | Low-latency inference for real-time text explanations; available via GitHub Models API |
| **Edge TTS** | — | Neural text-to-speech | High-quality neural voices; no API key required; supports word-level timestamps |
| **Cloudinary** | — | Audio file storage | CDN-backed media delivery; automatic format optimization |
| **Razorpay** | — | Payment gateway | Supports recurring subscriptions with webhook-based state management; suited for INR-based transactions |
| **Resend** | 2.23.0 | Transactional emails | Simple API for admin notifications and pipeline reports |
| **BeautifulSoup / Trafilatura** | 4.14.3 / 2.0.0 | Web scraping | Content extraction from diverse HTML structures; trafilatura handles boilerplate removal |
| **DuckDuckGo Search (ddgs)** | — | Source discovery | Privacy-preserving search; no API key required; returns authoritative URLs for topics |
| **Gunicorn** | 25.0.1 | Production WSGI server | Multi-worker process model for handling concurrent requests on Render |
| **GitHub Actions** | — | CI/CD and Cron Jobs | Automated daily pipeline execution via scheduled workflows |

### 3.2.2 Frontend Stack

| Technology | Version | Purpose | Justification |
|---|---|---|---|
| **React** | 19.2.0 | UI library | Component-based architecture; large ecosystem; concurrent rendering support |
| **TypeScript** | 5.9.3 | Type-safe JavaScript | Compile-time error detection; improved IDE support and refactoring safety |
| **Vite** | 7.2.4 | Build tool and dev server | Near-instant HMR; significantly faster than Webpack for development |
| **Tailwind CSS** | 4.2.1 | Utility-first CSS | Rapid UI development; consistent design tokens; purges unused CSS in production |
| **Framer Motion** | 12.34.3 | Animation library | Declarative animation API; supports layout animations and gesture handling |
| **Redux Toolkit** | 2.11.2 | Global state management | Centralized auth state; slice-based architecture with built-in immutability |
| **React Router** | 7.13.0 | Client-side routing | Declarative routing with nested layouts and route protection |
| **Mermaid.js** | 11.12.3 | Diagram rendering | Renders architectural diagrams from the compiled JSON directly in the browser |
| **Axios** | 1.13.5 | HTTP client | Interceptor support for JWT token injection; request/response transformation |

### 3.2.3 Typography

| Font | Type | Weights | Usage |
|---|---|---|---|
| **Inter** | Sans-serif | 400-900 | Primary UI typeface for all content |
| **JetBrains Mono** | Monospace | 400-700 | Code snippets, technical labels, status badges |

Both fonts are loaded from Google Fonts via the HTML entry point.

## 3.3 Event Table

| Event | Trigger | Actor | System Response |
|---|---|---|---|
| Visit Home Page | URL navigation | Visitor | Render landing page with typing animation, feature slideshow |
| Click "Access Briefing" | Button click | Visitor | Redirect to Google OAuth login page |
| Google OAuth callback | OAuth redirect | System | Verify token, create or fetch user, issue JWT |
| View Today's Briefing (free) | Page load | Free User | Fetch a random public article from any domain |
| View Today's Briefing (subscriber) | Page load | Subscriber | Fetch subscriber-exclusive article for the subscribed domain |
| Highlight text on article | Text selection | Subscriber | Invoke AI Tutor (GPT-4o-mini) for contextual explanation |
| Toggle Commuter Mode | Button click | Subscriber | Stream audio from Cloudinary URL stored in PostgreSQL |
| Toggle dark/light theme | Navbar button | Any User | Toggle CSS class on root element; persist to localStorage |
| Subscribe to a plan | Pricing page | User | Create Razorpay subscription; redirect to payment |
| Razorpay webhook fires | Payment event | Razorpay | Activate, renew, or cancel subscription in database |
| Free cron job executes | GitHub Actions (8:00 PM IST) | System | Run pipeline for one random domain; create candidate article awaiting admin approval |
| Premium cron job executes | GitHub Actions (5:00 PM IST) | System | Run pipeline for all domains; auto-publish subscriber articles directly |
| Admin triggers pipeline manually | Admin panel button | Admin | Start background pipeline job for specified domain(s) |
| Admin reviews candidate | Admin panel | Admin | Approve (schedule publication date) or reject (with reason) |
| Create workspace | Settings page | Team Admin | Create workspace with seat limit; add team members by email |
| Pipeline generates child topics | Automated | System | Insert child concept nodes into knowledge graph; link to parent and domain |

## 3.4 Use Case Diagram and Descriptions

```mermaid
graph TD
    subgraph Actors
        V["Visitor"]
        FU["Free User"]
        SU["Subscriber"]
        TA["Team Admin"]
        PA["Platform Admin"]
        GH["GitHub Actions Cron"]
    end

    subgraph "Use Cases"
        UC1["View Home Page"]
        UC2["Login via Google OAuth"]
        UC3["View Random Public Article"]
        UC4["Subscribe to Domain Plan"]
        UC5["View Subscriber Article"]
        UC6["Use AI Tutor"]
        UC7["Listen in Commuter Mode"]
        UC8["Create Team Workspace"]
        UC9["Invite Members to Workspace"]
        UC10["Review Candidate Articles"]
        UC11["Trigger Pipeline Manually"]
        UC12["Auto-Generate Free Article"]
        UC13["Auto-Generate All Domain Articles"]
        UC14["View Dashboard"]
        UC15["Toggle Theme"]
    end

    V --> UC1
    V --> UC2
    V --> UC15
    FU --> UC3
    FU --> UC4
    FU --> UC14
    SU --> UC5
    SU --> UC6
    SU --> UC7
    SU --> UC14
    TA --> UC8
    TA --> UC9
    TA --> UC4
    PA --> UC10
    PA --> UC11
    GH --> UC12
    GH --> UC13
```

### Use Case Descriptions

| Use Case | Actor | Precondition | Flow | Postcondition |
|---|---|---|---|---|
| **View Random Public Article** | Free User | User is logged in; no active subscription | System fetches today's public-audience article from any available domain | Article markdown and diagram rendered; audio and AI Tutor are not available |
| **View Subscriber Article** | Subscriber | User has active subscription to at least one domain | System fetches today's subscriber-exclusive article for the subscribed domain | Full article with diagram, Commuter Mode audio, and AI Tutor access |
| **Use AI Tutor** | Subscriber | User is reading a subscriber article | User highlights text; frontend sends selection + surrounding paragraph to API; GPT-4o-mini returns 3-sentence explanation | Explanation popover appears centered on screen |
| **Review Candidate Articles** | Platform Admin | Candidate exists with status "pending" | Admin views article preview; approves with scheduled date or rejects with reason | Article moves to published_articles (if approved) or is marked rejected |
| **Auto-Generate Free Article** | GitHub Actions | Cron triggers at 8:00 PM IST daily | Pipeline picks one random topic, scrapes sources, compiles via Gemini, stores as candidate | Article candidate created with status "pending"; awaits admin approval |
| **Auto-Generate All Domain Articles** | GitHub Actions | Cron triggers at 5:00 PM IST daily | Pipeline iterates all domains, picks topic per domain, compiles, generates audio, auto-publishes | Subscriber articles published for next day; visibility set to "subscriber" |
| **Create Team Workspace** | Team Admin | User is a software developer who wants team learning | Creates workspace; purchases team subscription (4x base price); invites members via email | Workspace created; invited members inherit subscription access to the domain |

## 3.5 Entity-Relationship Diagram

The database uses a **relational + graph hybrid** design. The core entity is `concept_nodes`, which represents both high-level engineering domains (e.g., "Databases", "System Design") and granular technical concepts (e.g., "Connection Pooling", "CAP Theorem"). Relationships between nodes are stored in `concept_edges` with a `strength` field that increments each time an edge is reinforced, enabling weighted topic selection.

The relational layer handles user management, subscription billing, workspace collaboration, and the article lifecycle (candidate → published). The graph layer enables intelligent, non-repetitive topic discovery.

```mermaid
erDiagram
    users {
        UUID id PK
        TEXT email UK
        BOOLEAN is_active
        TIMESTAMP created_at
    }
    user_roles {
        UUID user_id FK
        TEXT role
    }
    plans {
        UUID id PK
        TEXT domain
        TEXT billing_cycle
        TEXT name
        INTEGER monthly_price
        JSONB features
        TEXT razorpay_plan_id UK
    }
    subscriptions {
        UUID id PK
        UUID user_id FK
        UUID plan_id FK
        TEXT status
        BOOLEAN is_team
        TEXT razorpay_subscription_id UK
    }
    workspaces {
        UUID id PK
        VARCHAR name
        UUID owner_id FK
        INTEGER seat_limit
    }
    workspace_members {
        UUID workspace_id FK
        UUID user_id FK
        VARCHAR role
    }
    concept_nodes {
        UUID id PK
        TEXT name UK
        TEXT node_type
        TIMESTAMP last_used_at
    }
    concept_edges {
        UUID id PK
        UUID from_node_id FK
        UUID to_node_id FK
        REAL strength
    }
    sources {
        UUID id PK
        TEXT url
        TEXT scrape_status
    }
    compiled_topics {
        UUID id PK
        UUID topic_node_id FK
        JSONB compiled_data
    }
    article_candidate {
        UUID id PK
        UUID compiled_topic_id FK
        UUID topic_node_id FK
        TEXT title
        TEXT slug
        TEXT article_md
        TEXT diagram
        TEXT status
        TEXT audio_url
        JSONB content_json
    }
    published_articles {
        UUID id PK
        UUID candidate_id FK
        UUID topic_node_id FK
        TEXT title
        TEXT slug
        TEXT article_md
        TEXT diagram
        TEXT audio_url
        DATE scheduled_for
        JSONB content_json
    }
    article_visibility {
        UUID published_article_id FK
        TEXT audience
    }

    users ||--o{ user_roles : "has"
    users ||--o{ subscriptions : "owns"
    plans ||--o{ subscriptions : "defines"
    users ||--o{ workspaces : "owns"
    workspaces ||--o{ workspace_members : "contains"
    users ||--o{ workspace_members : "joins"
    concept_nodes ||--o{ concept_edges : "from"
    concept_nodes ||--o{ concept_edges : "to"
    concept_nodes ||--o{ compiled_topics : "compiles"
    compiled_topics ||--o{ article_candidate : "generates"
    article_candidate ||--o| published_articles : "publishes"
    published_articles ||--o| article_visibility : "controls"
```

## 3.6 Flow Diagrams

### 3.6.1 Free Article Pipeline (GitHub Actions Cron — 8:00 PM IST)

```mermaid
flowchart TD
    A["GitHub Actions Cron 8:00 PM IST"] --> B["POST /api/pipeline/run"]
    B --> C["pick_topic - Random Domain"]
    C --> D{"Topic Found?"}
    D -- No --> E["Raise Error: Domain Exhausted"]
    D -- Yes --> F["fetch_candidate_source via DuckDuckGo"]
    F --> G["store_sources_bulk in PostgreSQL"]
    G --> H["scrape_and_store - Extract Clean Text"]
    H --> I["compile_topic via Gemini 2.5 Flash"]
    I --> J["Receive Structured JSON"]
    J --> K["render_article_md from JSON"]
    J --> L["Extract Mermaid Diagram from JSON"]
    K --> M["create_commuter_audio via Edge TTS"]
    M --> N["Upload MP3 to Cloudinary"]
    N --> O["Store audio_url in PostgreSQL"]
    O --> P["create_candidate status: pending"]
    P --> Q["Await Admin Approval"]
    Q --> R{"Admin Decision"}
    R -- Approve --> S["publish_article with scheduled date"]
    S --> T["set_article_audience: public"]
    R -- Reject --> U["Mark rejected with reason"]
```

### 3.6.2 Premium Article Pipeline (GitHub Actions Cron — 5:00 PM IST)

```mermaid
flowchart TD
    A["GitHub Actions Cron 5:00 PM IST"] --> B["POST /api/pipeline/start-all"]
    B --> C["get_all_domain_names from concept_nodes"]
    C --> D["For Each Domain"]
    D --> E["pick_topic_domain for specific domain"]
    E --> F{"Topic Found?"}
    F -- No --> G["Log: Domain Exhausted - Skip"]
    F -- Yes --> H["fetch_candidate_source via DuckDuckGo"]
    H --> I["scrape_and_store - Extract Clean Text"]
    I --> J["compile_topic via Gemini 2.5 Flash"]
    J --> K["Receive Structured JSON"]
    K --> L["render_article_md from JSON"]
    K --> M["Extract Mermaid Diagram from JSON"]
    L --> N["create_commuter_audio via Edge TTS"]
    N --> O["Upload MP3 to Cloudinary"]
    O --> P["Store audio_url in PostgreSQL"]
    P --> Q["create_candidate"]
    Q --> R["publish_article scheduled for tomorrow"]
    R --> S["set_article_audience: subscriber"]
    S --> T["Link topic to domain in graph"]
    T --> U["add_child_topics to knowledge graph"]
    U --> V["Send email notification to admins"]
    V --> W["Next Domain"]
    G --> W
```

### 3.6.3 Knowledge Graph Child Topic Linking

When the Gemini model compiles an article, it also returns a `child_topics` array of related concepts. The system inserts each child as a new `concept` node and creates two edges:

1. **Parent → Child**: Links the current topic to its subtopics (e.g., "Connection Pooling" → "PgBouncer")
2. **Domain → Child**: Links the domain directly to the child concept (e.g., "Databases" → "PgBouncer")

This ensures that child topics are reachable from their parent domain during future topic selection, preventing orphaned concepts that would never be selected.

```mermaid
graph TD
    D["Domain: Databases"] --> P["Parent: Connection Pooling"]
    P --> C1["Child: PgBouncer"]
    P --> C2["Child: HikariCP"]
    D --> C1
    D --> C2
```

## 3.7 Class Diagram

```mermaid
classDiagram
    class PipelineService {
        +run_pipeline()
        +run_premium_pipeline(domain)
        +run_all_domains_pipeline()
        +start_premium_pipeline_job(domain)
        +render_article_md(compiled)
    }
    class TopicPicker {
        +pick_topic()
        +pick_topic_domain(domain_name)
    }
    class TopicCompiler {
        +compile_topic(topic_name, concepts, scraped_data)
    }
    class AudioService {
        +generate_audio_and_upload(text, slug)
        +create_commuter_audio(text, slug, domain, title)
    }
    class ExplainService {
        +fetch_explanation(highlighted_text, context)
    }
    class ChildTopicService {
        +add_child_topics(parent_id, children, domain)
    }
    class SourceScrapeService {
        +scrape_and_store(source_id, url)
    }
    class Fetcher {
        +fetch_candidate_source(topic_name)
    }
    class PublishedArticles {
        +publish_article()
        +get_todays_published_article(domain)
        +get_todays_subscriber_article(domain)
        +get_article_by_slug_with_domain(slug)
    }
    class UserModel {
        +get_or_create_user(email)
        +get_user_active_subscription(user_id)
        +get_user_active_subscriptions(user_id)
    }
    class WorkspaceService {
        +create_workspace()
        +add_member()
        +remove_member()
    }
    class RazorpayService {
        +create_plan()
        +create_subscription()
    }

    PipelineService --> TopicPicker
    PipelineService --> Fetcher
    PipelineService --> SourceScrapeService
    PipelineService --> TopicCompiler
    PipelineService --> AudioService
    PipelineService --> PublishedArticles
    PipelineService --> ChildTopicService
    ChildTopicService --> PublishedArticles
    WorkspaceService --> UserModel
    RazorpayService --> UserModel
```

## 3.8 Sequence Diagrams

### 3.8.1 Premium Article Generation Pipeline

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant API as Flask API
    participant Auth as Pipeline Auth
    participant TP as TopicPicker
    participant DB as PostgreSQL
    participant DDG as DuckDuckGo
    participant Scraper as Scraper
    participant Gemini as Gemini 2.5 Flash
    participant TTS as Edge TTS
    participant Cloud as Cloudinary

    GH->>API: POST /api/pipeline/start-all
    API->>Auth: Verify PIPELINE_TOKEN
    Auth-->>API: Authorized

    loop For each domain
        API->>TP: pick_topic_domain(domain)
        TP->>DB: SELECT unused concept WHERE domain
        DB-->>TP: topic_id, topic_name
        TP-->>API: topic data

        API->>DDG: Search topic_name
        DDG-->>API: List of URLs
        API->>DB: INSERT INTO sources

        API->>Scraper: scrape_and_store(urls)
        Scraper-->>API: Extracted text

        API->>Gemini: compile_topic(topic, scraped_data)
        Gemini-->>API: Structured JSON with mermaid diagram

        API->>TTS: create_commuter_audio(text)
        TTS-->>API: Audio MP3 bytes
        API->>Cloud: Upload MP3
        Cloud-->>API: audio_url

        API->>DB: INSERT article_candidate
        API->>DB: INSERT published_articles with audio_url
        API->>DB: INSERT article_visibility subscriber
        API->>DB: INSERT concept_edges for child topics
    end

    API-->>GH: 202 Accepted with job_id
```

### 3.8.2 User Authentication Flow

```mermaid
sequenceDiagram
    participant User as Browser
    participant FE as React Frontend
    participant Google as Google OAuth
    participant API as Flask API
    participant DB as PostgreSQL

    User->>FE: Click Login with Google
    FE->>Google: Open OAuth consent screen
    Google-->>FE: Return id_token
    FE->>API: POST /api/auth/google with id_token
    API->>Google: verify_oauth2_token
    Google-->>API: email, sub
    API->>DB: get_or_create_user(email)
    DB-->>API: user_id
    API->>DB: get_auth_context(user_id)
    DB-->>API: role, subscription
    API->>API: create_jwt(user_id, email, role)
    API-->>FE: access_token + user object
    FE->>FE: Store token in localStorage
    FE->>FE: Redirect to Dashboard
```

### 3.8.3 Subscription Purchase Flow

```mermaid
sequenceDiagram
    participant User as Browser
    participant FE as React Frontend
    participant API as Flask API
    participant RP as Razorpay
    participant DB as PostgreSQL

    User->>FE: Select plan on Pricing page
    FE->>API: POST /api/subscriptions/subscribe with plan_id
    API->>DB: Fetch plan details
    API->>RP: create_plan if not cached
    RP-->>API: razorpay_plan_id
    API->>RP: create_subscription
    RP-->>API: subscription_id, short_url
    API->>DB: INSERT subscription status pending
    API-->>FE: razorpay subscription_id

    FE->>RP: Open Razorpay checkout
    User->>RP: Complete payment
    RP->>API: POST /api/subscriptions/webhook
    API->>API: Verify HMAC signature
    API->>DB: UPDATE subscription status active
    API-->>RP: 200 OK
```

## 3.9 State Diagram (Article Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> TopicSelected : Pipeline picks topic
    TopicSelected --> SourcesFetched : DuckDuckGo search
    SourcesFetched --> SourcesScraped : Web scraping
    SourcesScraped --> Compiled : Gemini AI structuring
    Compiled --> AudioGenerated : Edge TTS synthesis
    AudioGenerated --> CandidateCreated : Store in article_candidate

    state fork_state <<fork>>
    CandidateCreated --> fork_state

    fork_state --> PendingReview : Free pipeline
    fork_state --> AutoPublished : Premium pipeline

    PendingReview --> Approved : Admin approves
    PendingReview --> Rejected : Admin rejects
    Approved --> PublishedPublic : Publish with audience public
    AutoPublished --> PublishedSubscriber : Publish with audience subscriber

    PublishedPublic --> [*]
    PublishedSubscriber --> [*]
    Rejected --> [*]
```

## 3.10 Menu Tree

```
LoopLearn
├── Home Page (/)
│   ├── #why — The Noise vs The Signal
│   ├── #who — Target audience cards
│   └── #how — The Protocol (3-step methodology)
│
├── Login (/login) — Google OAuth sign-in
│
├── Dashboard (/dashboard) — Subscribed domains and article access
│
├── Today's Briefing (/todays)
│   ├── Article Content (Markdown rendered)
│   ├── Mermaid Diagram (extracted from compiled JSON)
│   ├── AI Tutor (subscriber only — text selection popover)
│   └── Commuter Mode (subscriber only — floating audio player)
│
├── Pricing (/pricing) — Individual and team plans with Razorpay
│
├── Subscription Success (/subscription/success)
│
├── Admin Panel (/admin) [Platform Admin only]
│   ├── Pipeline Trigger (per-domain / all-domains)
│   └── Candidate Review (approve/reject/schedule)
│
└── Navbar (Global)
    ├── Theme Toggle (Light / Dark)
    ├── Navigation Links
    └── Logout
```
