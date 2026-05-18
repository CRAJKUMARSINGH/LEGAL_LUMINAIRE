# Harvey.ai Integration Guide

## Overview

Legal Luminaire now supports integration with [Harvey.ai](https://www.harvey.ai/), a legal-grade AI platform designed for professional legal services. This integration provides:

- **Legal-grade AI responses** with built-in citations
- **Vault API** for secure document storage and management
- **Regional compliance** support (US, EU, AU endpoints)
- **Model selection** (GPT-5, Claude Opus, etc.)
- **Knowledge sources** integration (Vault, Web search)

## Configuration

### 1. Get Harvey.ai Access

Contact Harvey.ai at [https://www.harvey.ai/](https://www.harvey.ai/) to obtain:
- API key (Bearer token)
- Workspace configuration
- Required permissions (Assistant access via API)

### 2. Configure Environment Variables

Add the following to your backend `.env` file:

```bash
# Harvey.ai Legal AI Configuration
HARVEY_API_KEY=your_harvey_api_key_here
HARVEY_REGION=us
HARVEY_ENABLED=true
HARVEY_MODEL=gpt-5
HARVEY_INCLUDE_CITATIONS=true
```

**Configuration Options:**

- `HARVEY_API_KEY`: Your Harvey API bearer token
- `HARVEY_REGION`: Region for compliance (`us`, `eu`, or `au`)
- `HARVEY_ENABLED`: Set to `true` to enable Harvey.ai integration
- `HARVEY_MODEL`: Model selector (e.g., `gpt-5`, `gpt-5-1`, `claude-opus-4-5`)
- `HARVEY_INCLUDE_CITATIONS`: Include inline citations in responses

### 3. Regional Endpoints

Harvey.ai supports regional endpoints for compliance:

- **US**: `https://api.harvey.ai` (default)
- **EU**: `https://eu.api.harvey.ai`
- **AU**: `https://au.api.harvey.ai`

Set `HARVEY_REGION` to use the appropriate endpoint.

## Usage

### Streamlit Frontend

1. Start the Streamlit application
2. In the sidebar, check **"Use Harvey.ai for legal research"**
3. The system will verify the Harvey.ai connection
4. When enabled, all research/draft requests will use Harvey.ai

### API Usage

#### Direct Harvey Completion

```python
import httpx

async def use_harvey_direct():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.harvey.ai/v2/completion",
            headers={
                "Authorization": "Bearer YOUR_API_KEY",
                "Content-Type": "application/json"
            },
            json={
                "prompt": "Draft a discharge application for construction negligence",
                "include_citations": True,
                "mode": "draft",
                "model": "gpt-5"
            }
        )
        return response.json()
```

#### Via Legal Luminaire API

```python
import requests

# Research with Harvey.ai enabled
response = requests.post(
    "http://localhost:8000/api/v1/cases/case01/research",
    json={
        "query": "Draft discharge application for construction negligence",
        "incident_type": "construction wall collapse",
        "evidence_type": "material sampling forensic lab report",
        "procedural_defects": ["no panchnama", "no chain of custody"],
        "mode": "draft",
        "use_harvey": True,
        "expertise_hint": "senior"
    }
)
```

## API Endpoints

### Harvey Health Check

```bash
GET /api/v1/harvey/health
```

Returns Harvey.ai configuration and connection status.

### Harvey Completion

```bash
POST /api/v1/harvey/completion
```

Send completion requests to Harvey.ai.

**Request Body:**
```json
{
  "prompt": "Legal question or drafting instruction (max 20,000 chars)",
  "model": "gpt-5",
  "include_citations": true,
  "stream": false,
  "mode": "draft",
  "knowledge_sources": [
    {"type": "vault", "folder_id": "project-id"}
  ],
  "client_matter_id": "optional-matter-id"
}
```

### Vault Operations

#### List Projects

```bash
GET /api/v1/harvey/vault/projects?page=1&per_page=20
```

#### Upload Files

```bash
POST /api/v1/harvey/vault/upload/{project_id}
```

#### Get Project Metadata

```bash
GET /api/v1/harvey/vault/project/{project_id}/metadata
```

#### Check File Status

```bash
GET /api/v1/harvey/vault/files/status?file_ids=id1,id2
```

#### Delete File

```bash
DELETE /api/v1/harvey/vault/file/{file_id}
```

#### Delete Project

```bash
DELETE /api/v1/harvey/vault/project/{project_id}
```

## Integration Points

### 1. Research Agent

The researcher agent (`agents/researcher.py`) now checks for Harvey.ai configuration and uses it when enabled.

### 2. Drafter Agent

The drafter agent (`agents/drafter.py`) supports Harvey.ai for legal document generation.

### 3. API Routes

The backend API (`api/routes.py`) includes Harvey.ai support in the research endpoint:
- Automatically uses Harvey.ai when `use_harvey=true` in request
- Falls back to standard CrewAI pipeline if Harvey.ai is not configured
- Maintains citation gate enforcement for all outputs

### 4. Streamlit Frontend

The Streamlit app (`streamlit_app.py`) includes:
- Harvey.ai connection status check
- Checkbox to enable/disable Harvey.ai
- Visual feedback on connection status

## Benefits

### For Legal Research

- **Citation accuracy**: Harvey provides inline citations with sources
- **Legal-grade responses**: Trained specifically for legal work
- **Knowledge base integration**: Use your Vault documents as context

### For Document Drafting

- **Professional quality**: Legal-grade document generation
- **Citation integration**: Automatic citation inclusion
- **Model selection**: Choose the best model for your needs

### For Compliance

- **Regional endpoints**: EU, AU, US regions for data residency
- **Secure Vault**: Document management with access controls
- **Audit trails**: Built-in logging and audit capabilities

## Troubleshooting

### Connection Issues

If Harvey.ai connection fails:

1. Verify `HARVEY_API_KEY` is set correctly
2. Check `HARVEY_ENABLED=true` in `.env`
3. Test connection: `GET /api/v1/harvey/health`
4. Check regional endpoint configuration

### Citation Issues

If citations are missing:

1. Verify `HARVEY_INCLUDE_CITATIONS=true`
2. Check that the prompt allows for citation generation
3. Review Harvey.ai model capabilities

### Performance

 Harvey.ai requests may take longer than local processing:

- Set appropriate timeout values
- Use streaming for long responses
- Consider knowledge sources for faster context loading

## Security Notes

- **Never commit `.env` file** to version control
- **Rotate API keys** regularly
- **Use regional endpoints** for compliance requirements
- **Review permissions** in Harvey workspace settings
- **Monitor usage** through Harvey's audit logs

## License

This integration is part of Legal Luminaire, licensed under MIT License.

## Support

For Harvey.ai-specific issues:
- Contact Harvey.ai support: [support@harvey.ai](mailto:support@harvey.ai)
- Documentation: [https://developers.harvey.ai](https://developers.harvey.ai)

For Legal Luminaire issues:
- GitHub: [https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE](https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE)
- Documentation: See `docs/` directory
