---
description: Copy-paste prompt to give external LLMs (ChatGPT, Claude, Gemini) full context on THE_y-it_PRO capabilities
---

# THE_y-it_PRO – LLM Integration Primer

**Copy everything below this line and paste it as context to any external LLM:**

---

## 🤖 SYSTEM CONTEXT: Y-IT NANO-BOOK GENERATOR

You are being integrated with **THE_y-it_PRO** (Y-It Nano-Book Generator), a React-based AI content generation platform that creates truth-exposing "nano-books" about side hustles and business opportunities using multi-agent AI research.

### Project Overview
- **Type:** React 19.2.1 + TypeScript 5.8.2 + Vite 6.2.0 web application
- **Purpose:** Generate data-driven books exposing realities of "get rich quick" schemes
- **Architecture:** Multi-agent system with Google Gemini API integration
- **Lines of Code:** ~4,330 TypeScript/TSX
- **Status:** Development (Production readiness: 8/10)

### Your Role
- Understand the multi-agent architecture
- Assist with feature development following existing patterns
- Maintain code quality standards (ESLint, Prettier, tests)
- Never expose API keys or bypass security measures

---

## 📋 PROJECT STRUCTURE

```
THE_y-it_PRO/
├── components/           # React UI components
│   ├── AgentStatus.tsx      # Real-time agent status display
│   ├── BookReader.tsx       # Interactive book viewer
│   ├── ErrorBoundary.tsx    # Error handling wrapper
│   ├── InputSection.tsx     # Topic input & config
│   ├── Loader.tsx           # Loading animations
│   ├── PodcastStudio.tsx    # Audio generation UI
│   └── ResearchDashboard.tsx # Data visualization
│
├── services/            # Business logic & API integration
│   ├── core/
│   │   ├── LLMClient.ts         # Singleton Gemini API client (TESTED)
│   │   └── SchemaValidator.ts   # Zod schemas for validation
│   ├── agents/
│   │   ├── BaseAgent.ts         # Abstract agent base class
│   │   ├── SpecializedAgents.ts # Detective, Auditor, Insider, Stat agents
│   │   └── AuthorAgent.ts       # Book generation agent
│   ├── media/
│   │   └── ImageService.ts      # AI image generation/editing
│   ├── audio/
│   │   ├── PodcastService.ts    # Text-to-speech conversion
│   │   └── VoiceConfig.ts       # Voice presets
│   └── orchestrator.ts      # Multi-agent coordinator
│
├── context/
│   └── ProjectContext.tsx   # Global state (React Context + Reducer)
│
├── utils/
│   ├── jsonParser.ts        # Robust JSON parsing from LLM
│   └── pdfExport.ts         # PDF generation with jsPDF
│
├── data/
│   └── demoData.ts          # Pre-generated demo content
│
├── .github/workflows/   # CI/CD automation
│   ├── ci.yml              # Main CI pipeline (lint, test, build)
│   └── pr-checks.yml       # PR quality gate
│
├── App.tsx              # Main application entry
├── types.ts             # TypeScript type definitions
├── constants.ts         # System prompts & specifications
└── vite.config.ts       # Build configuration
```

---

## 🛠️ AVAILABLE NPM SCRIPTS

| Command | Description | Risk Level |
|---------|-------------|------------|
| `npm run dev` | Start development server (port 3000) | **safe** |
| `npm run build` | Production build with optimizations | **safe** |
| `npm run preview` | Preview production build | **safe** |
| `npm run lint` | Run ESLint code quality checks | **safe** |
| `npm run lint:fix` | Auto-fix ESLint issues | **caution** |
| `npm run format` | Format code with Prettier | **caution** |
| `npm test` | Run Vitest unit tests | **safe** |
| `npm run test:ui` | Run tests with UI dashboard | **safe** |
| `npm run test:coverage` | Generate test coverage report | **safe** |

---

## 🏗️ ARCHITECTURE PATTERNS

### 1. Multi-Agent Research System
**Pattern:** Parallel execution with graceful degradation

```typescript
// 4 specialized agents run in parallel via Promise.allSettled()
const agents = [
  new DetectiveAgent(),  // Finds victim stories & scams
  new AuditorAgent(),    // Uncovers hidden costs
  new InsiderAgent(),    // Identifies affiliate programs
  new StatAgent()        // Finds failure rates & statistics
];

// Continues even if some agents fail
const results = await Promise.allSettled(promises);
```

**Files:** `services/orchestrator.ts`, `services/agents/SpecializedAgents.ts`

### 2. Singleton LLM Client
**Pattern:** Single instance with retry logic and exponential backoff

```typescript
const client = LLMClient.getInstance();
const response = await client.generateContentWithRetry({
  model: 'gemini-2.5-flash',
  contents: 'Your prompt'
}, 3, 2000); // 3 retries, 2s initial delay
```

**File:** `services/core/LLMClient.ts`

### 3. Schema-First Validation
**Pattern:** TypeScript types + Zod runtime validation

```typescript
// Type from Zod schema
export type ValidatedBook = z.infer<typeof BookSchema>;

// Runtime validation
const validated = BookSchema.parse(llmResponse);
```

**File:** `services/core/SchemaValidator.ts`

### 4. React Context + Reducer
**Pattern:** Git-inspired branching for book iterations

```typescript
const { state, startInvestigation, createBranch } = useProject();

// Create alternative version with different settings
await createBranch(newSettings);
```

**File:** `context/ProjectContext.tsx`

---

## 🔐 SECURITY GUIDELINES (CRITICAL)

### PROTECTED SECRETS
**NEVER expose, log, or commit:**
- `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` / `API_KEY`
- `.env` files (now properly in .gitignore)
- Any API credentials in code comments

### Environment Variable Handling
```typescript
// ✅ CORRECT (supports 3 sources)
const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY)
  ? (import.meta as any).env.VITE_GEMINI_API_KEY
  : (process.env.GEMINI_API_KEY || process.env.API_KEY);

// ❌ WRONG (hardcoded)
const apiKey = "AIzaSy...";  // NEVER DO THIS
```

### Git Safety
- `.env` patterns are in .gitignore (as of recent security fix)
- Only placeholder keys were ever in git history (audited: SAFE)
- Never use `git push --force` to main
- All changes go through feature branches with session IDs

---

## 📚 COMMON DEVELOPMENT TASKS

### Task 1: Add New Research Agent
**Template:** `new_research_agent`

```json
{
  "type": "directive",
  "description": "Create new specialized research agent",
  "steps": [
    {
      "action": "file",
      "path": "services/agents/SpecializedAgents.ts",
      "content": "Add new agent class extending BaseAgent",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "constants.ts",
      "content": "Add agent system prompt constant",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "services/orchestrator.ts",
      "content": "Add agent to ResearchCoordinator constructor",
      "risk": "caution"
    }
  ],
  "warnings": ["Must extend BaseAgent", "Add JSDoc comments", "Update tests"],
  "requiresConfirmation": true
}
```

### Task 2: Add New Component
**Template:** `new_react_component`

```json
{
  "type": "directive",
  "description": "Create new React component with TypeScript",
  "steps": [
    {
      "action": "file",
      "path": "components/YourComponent.tsx",
      "content": "React.FC component with proper types",
      "risk": "safe"
    },
    {
      "action": "command",
      "content": "npm run lint:fix",
      "risk": "caution"
    }
  ],
  "templates": ["react_component"],
  "warnings": ["Follow existing component patterns", "Add proper TypeScript types"],
  "requiresConfirmation": false
}
```

### Task 3: Add Unit Tests
**Template:** `add_unit_tests`

```json
{
  "type": "directive",
  "description": "Add unit tests for service/component",
  "steps": [
    {
      "action": "file",
      "path": "services/your-service.test.ts",
      "content": "Vitest test suite with describe/it/expect",
      "risk": "safe"
    },
    {
      "action": "command",
      "content": "npm test",
      "risk": "safe"
    }
  ],
  "warnings": ["Follow existing test patterns in LLMClient.test.ts"],
  "requiresConfirmation": false
}
```

### Task 4: Update Documentation
**Template:** `add_jsdoc`

```json
{
  "type": "directive",
  "description": "Add JSDoc comments to public methods",
  "steps": [
    {
      "action": "file",
      "content": "Add @param, @returns, @throws, @example tags",
      "risk": "safe"
    }
  ],
  "warnings": ["See existing JSDoc in LLMClient.ts for format"],
  "requiresConfirmation": false
}
```

---

## ⚠️ DEVELOPMENT RULES

### ALWAYS DO:
1. ✅ Run `npm run lint` before committing
2. ✅ Add JSDoc comments to new public methods
3. ✅ Update/add tests for new functionality
4. ✅ Use existing patterns (singleton, schema validation, parallel agents)
5. ✅ Handle errors gracefully (try-catch with user-friendly messages)
6. ✅ Validate LLM responses with Zod schemas
7. ✅ Create feature branches with `claude/` prefix and session ID suffix

### NEVER DO:
1. ❌ Commit `.env` files or API keys
2. ❌ Use `any` type without good reason (prefer unknown)
3. ❌ Skip error handling on API calls
4. ❌ Bypass schema validation for LLM responses
5. ❌ Use `console.log` in production (use proper logging)
6. ❌ Modify files without reading them first
7. ❌ Push directly to `main` branch

### CODE QUALITY STANDARDS:
- **TypeScript:** Strict mode enabled, no implicit any
- **Linting:** ESLint with React + TypeScript rules
- **Formatting:** Prettier (2 spaces, semicolons, double quotes)
- **Testing:** Vitest with happy-dom environment
- **Docs:** JSDoc for all public APIs

---

## 🎯 TECH STACK REFERENCE

### Frontend
- **Framework:** React 19.2.1 (no react-in-jsx-scope needed)
- **Bundler:** Vite 6.2.0 (ES2022 target)
- **Styling:** Tailwind CSS (via CDN)
- **Icons:** lucide-react 0.559.0
- **Markdown:** react-markdown 10.1.0
- **Charts:** recharts 3.5.1

### Backend/Services
- **AI API:** @google/genai 1.33.0 (Gemini)
- **Validation:** Zod 3.22.4
- **PDF Export:** jsPDF 2.5.1

### Development
- **Language:** TypeScript 5.8.2
- **Linting:** ESLint 8.57.0 + @typescript-eslint
- **Formatting:** Prettier 3.2.5
- **Testing:** Vitest 1.2.0 + happy-dom
- **CI/CD:** GitHub Actions

### Browser Support
- Chrome >= 90
- Firefox >= 88
- Safari >= 15
- Edge >= 90
- No IE11 support

---

## 🔄 WORKFLOW EXAMPLES

### Example 1: User Request - "Add a new research agent for legal violations"

**Your Structured Response:**

I'll help you create a new LegalAgent that investigates regulatory and legal violations. Here's the execution plan:

#### Plan Overview
1. Create new agent class extending BaseAgent
2. Add legal research system prompt to constants
3. Integrate agent into orchestrator
4. Add tests for the new agent

#### Directive
```json
{
  "type": "directive",
  "description": "Create LegalAgent for regulatory violation research",
  "steps": [
    {
      "action": "file",
      "path": "services/agents/SpecializedAgents.ts",
      "content": "export class LegalAgent extends BaseAgent {\n  constructor() { super('Legal'); }\n  async run(topic: string): Promise<string> {\n    return this.executeSearch(\n      LEGAL_AGENT_PROMPT,\n      `Investigate legal violations and regulatory issues for: \"${topic}\"`\n    );\n  }\n}",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "constants.ts",
      "content": "export const LEGAL_AGENT_PROMPT = `You are a legal analyst specializing in business regulation and compliance violations...`",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "services/orchestrator.ts",
      "content": "Add 'new LegalAgent()' to agents array in constructor",
      "risk": "caution"
    }
  ],
  "warnings": [
    "Will modify 3 existing files",
    "Must add LegalAgent import to orchestrator",
    "Consider adding to AgentState type if UI needs updating"
  ],
  "requiresConfirmation": true
}
```

#### What This Will Do
- Create a new `LegalAgent` class following the existing pattern
- Add specialized system prompt for legal research
- Integrate into the parallel agent execution system
- The agent will run alongside Detective, Auditor, Insider, and Stat agents

**Next Steps After Execution:**
1. Run `npm run lint:fix` to format the code
2. Add unit tests in `services/agents/LegalAgent.test.ts`
3. Update UI in `AgentStatus.tsx` if needed
4. Test with a sample topic

---

### Example 2: User Request - "Optimize the PDF export for large books"

**Your Structured Response:**

I'll help optimize the PDF export functionality. Here's the analysis and plan:

#### Current Issue
The `pdfExport.ts` file (237 lines) generates PDFs client-side, which can cause memory issues with large books (20+ chapters with images).

#### Optimization Plan
1. Implement progressive rendering (render pages in chunks)
2. Add image compression before embedding
3. Add progress callback for UI feedback
4. Consider moving to web worker for non-blocking operation

#### Directive
```json
{
  "type": "directive",
  "description": "Optimize PDF export with chunked rendering and image compression",
  "steps": [
    {
      "action": "file",
      "path": "utils/pdfExport.ts",
      "content": "Add image compression utility function",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "utils/pdfExport.ts",
      "content": "Add progress callback parameter to downloadPdf()",
      "risk": "caution"
    },
    {
      "action": "file",
      "path": "components/BookReader.tsx",
      "content": "Add progress indicator for PDF export",
      "risk": "caution"
    }
  ],
  "warnings": [
    "Will modify PDF export logic (test thoroughly)",
    "May require updating BookReader component props",
    "Consider adding new dependency for image compression"
  ],
  "requiresConfirmation": true
}
```

---

## 🧪 TESTING GUIDELINES

### Current Test Coverage
- **Overall:** Baseline (14 tests for LLMClient)
- **Target:** 60%+ coverage
- **Framework:** Vitest with happy-dom

### Test Pattern (follow LLMClient.test.ts)
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('YourService', () => {
  let service: YourService;

  beforeEach(() => {
    service = new YourService();
  });

  describe('Method Name', () => {
    it('should do something specific', () => {
      expect(service.method()).toBeDefined();
    });
  });
});
```

### What to Test
- ✅ Singleton patterns (same instance)
- ✅ Error handling (try-catch paths)
- ✅ Retry logic (exponential backoff)
- ✅ Schema validation (valid/invalid inputs)
- ✅ State transitions (React reducer actions)

---

## 📊 CI/CD PIPELINE

### GitHub Actions Workflows

**On Push/PR:**
1. **Lint Check** (`npm run lint`)
2. **Type Check** (`npx tsc --noEmit`)
3. **Tests** (`npm test`)
4. **Build** (`npm run build`)
5. **Upload Artifacts** (dist/ retained 7 days)

**PR Quality Gate (additional):**
- Format check (`npm run format -- --check`)
- All checks must pass before merge

### Branch Naming Convention
- Feature branches: `claude/feature-name-<sessionId>`
- Must start with `claude/` and end with session ID
- Example: `claude/add-legal-agent-01AGy1ANEo3qRvzeDQQdUPVK`

---

## 🎨 UI/UX PATTERNS

### Tab Navigation
- **Research Tab:** Data visualizations, statistics, case studies
- **Book Tab:** Interactive reader with image editing
- **Podcast Tab:** Audio generation from book content

### Git-Inspired Branching
- Users can create alternative drafts ("branches")
- Each branch has different generation settings
- Switch between drafts without losing work

### Demo Mode
- Pre-loaded example (Dropshipping topic)
- No API key required
- Instant preview of functionality

---

## 🚨 ERROR HANDLING PATTERNS

### LLM API Errors
```typescript
try {
  const response = await client.generateContentWithRetry(params);
} catch (error: any) {
  // Fatal errors: 400 (bad request), 403 (forbidden)
  // Retryable errors: 429 (rate limit), 5xx (server)
  console.error("LLM Error:", error.message);
  throw new Error("User-friendly message");
}
```

### React Error Boundary
```typescript
// All components wrapped in ErrorBoundary (index.tsx)
// Catches uncaught errors and displays user-friendly UI
```

### Agent Failures
```typescript
// Agents use Promise.allSettled for graceful degradation
// Continues with partial results if some agents fail
const results = await Promise.allSettled(agentPromises);
```

---

## 📝 DOCUMENTATION REQUIREMENTS

### JSDoc Format (see LLMClient.ts for examples)
```typescript
/**
 * Brief description of what this does.
 * Additional context about behavior, constraints, or patterns.
 *
 * @param {Type} paramName - Description of parameter
 * @returns {ReturnType} Description of return value
 * @throws {Error} When and why errors are thrown
 *
 * @example
 * ```typescript
 * const result = await yourMethod(param);
 * ```
 */
```

### Required Documentation
- All public methods and classes
- Complex algorithms or business logic
- Integration points with external APIs
- Error scenarios and recovery strategies

---

## 🔗 USEFUL FILE REFERENCES

### Type Definitions
- **Main types:** `types.ts` (Book, Chapter, ResearchData, GenSettings, etc.)
- **Validated types:** `services/core/SchemaValidator.ts` (Zod inferred)

### System Prompts
- **All prompts:** `constants.ts`
  - RESEARCH_SYSTEM_PROMPT
  - AUTHOR_SYSTEM_PROMPT
  - DETECTIVE_AGENT_PROMPT
  - AUDITOR_AGENT_PROMPT
  - INSIDER_AGENT_PROMPT
  - STAT_AGENT_PROMPT
  - Y_IT_NANO_BOOK_SPEC (8-chapter structure)

### Configuration
- **Build:** `vite.config.ts` (code splitting, terser, env vars)
- **TypeScript:** `tsconfig.json` (ES2022, strict mode)
- **Tests:** `vitest.config.ts` (happy-dom, globals)
- **Browser targets:** `.browserslistrc`

---

## 🎯 SUMMARY FOR EXTERNAL LLMs

When working with THE_y-it_PRO:

1. **You are assisting with a multi-agent AI book generation platform**
2. **Follow existing patterns:** Singleton, schema validation, parallel execution
3. **Maintain quality:** ESLint, tests, JSDoc, type safety
4. **Never expose secrets:** API keys stay in .env (not committed)
5. **Use structured directives:** JSON format with risk levels
6. **Test everything:** Add tests for new functionality
7. **Document thoroughly:** JSDoc for all public APIs

### Quick Architecture Summary
- **Frontend:** React 19 + TypeScript + Tailwind
- **State:** Context + Reducer pattern
- **AI:** 4 parallel research agents + 1 author agent
- **Validation:** Zod schemas for all LLM responses
- **Testing:** Vitest (14 tests, expanding)
- **CI/CD:** GitHub Actions (lint, test, build)
- **Build:** Vite with code splitting and optimization

### Production Readiness: 8/10
- ✅ Security fixed (API keys protected)
- ✅ Testing infrastructure (baseline coverage)
- ✅ Code quality tools (ESLint, Prettier)
- ✅ CI/CD pipeline (automated checks)
- ✅ Documentation (JSDoc on core services)
- ⏳ Need: 60%+ test coverage, monitoring, E2E tests

---

*THE_y-it_PRO LLM Integration Guide v1.0 – "Truth-Powered Content Generation"*
*For the comprehensive codebase review, see CODEBASE_REVIEW.md*
