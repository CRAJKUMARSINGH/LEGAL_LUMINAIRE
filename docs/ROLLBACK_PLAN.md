# ROLLBACK PLAN
## Legal Intelligence Hybrid Integration

**Date**: April 29, 2026  
**Version**: 1.0  
**Emergency Contact**: System Administrator

---

## OVERVIEW

This document provides step-by-step instructions for rolling back the Legal Intelligence Hybrid Integration if critical issues are discovered post-deployment.

---

## ROLLBACK TRIGGERS

Execute rollback if ANY of the following occur:

### Critical (Immediate Rollback)
- ❌ Citation gate system failure
- ❌ Existing features broken or inaccessible
- ❌ Data loss or corruption
- ❌ Security vulnerability introduced
- ❌ System crashes or becomes unresponsive
- ❌ Legal accuracy degradation detected

### High Priority (Rollback within 1 hour)
- ⚠️ Performance degradation > 50%
- ⚠️ Search accuracy drops below baseline
- ⚠️ Multiple user-reported critical bugs
- ⚠️ Backend service failures

### Medium Priority (Rollback within 4 hours)
- 🟡 UI/UX issues affecting workflow
- 🟡 Non-critical feature malfunctions
- 🟡 Performance degradation 20-50%

---

## ROLLBACK METHODS

### Method 1: Feature Flag Rollback (FASTEST - 30 seconds)

**Use When**: New features causing issues, but core system intact

**Steps**:
1. Open `.env` or environment configuration
2. Set all new feature flags to `false`:
   ```bash
   # Search Engine V2
   VITE_FF_ENABLE_ADVANCED_SEARCH_V2=false
   VITE_FF_ENABLE_QUERY_EXPANSION=false
   VITE_FF_ENABLE_ENHANCED_RANKING=false
   
   # Citation Intelligence
   VITE_FF_ENABLE_CITATION_GRAPH=false
   VITE_FF_ENABLE_CITATION_EXTRACTION=false
   VITE_FF_ENABLE_AUTHORITY_RANKING=false
   
   # AI Reasoning
   VITE_FF_ENABLE_CASE_SIMILARITY=false
   VITE_FF_ENABLE_MULTI_LAYER_SCORING=false
   VITE_FF_ENABLE_EXPLANATION_GENERATOR=false
   
   # Analytics
   VITE_FF_ENABLE_JUDGE_ANALYTICS=false
   VITE_FF_ENABLE_COURT_ANALYTICS=false
   VITE_FF_ENABLE_OUTCOME_PREDICTION=false
   
   # Visualization
   VITE_FF_ENABLE_GRAPH_VISUALIZATION=false
   VITE_FF_ENABLE_INTERACTIVE_GRAPH=false
   VITE_FF_ENABLE_TIMELINE_MODE=false
   ```
3. Restart frontend: `pnpm --filter @workspace/legal-luminaire run dev`
4. Restart backend: `cd artifacts/legal-luminaire/backend && python main.py`
5. Verify system functionality

**Rollback Time**: 30 seconds  
**Data Loss**: None  
**User Impact**: Minimal (new features disabled)

---

### Method 2: Git Branch Rollback (SAFE - 5 minutes)

**Use When**: Code changes causing issues

**Steps**:
1. Identify the last known good commit:
   ```bash
   git log --oneline
   ```
2. Create a rollback branch:
   ```bash
   git checkout -b rollback/emergency-$(date +%Y%m%d-%H%M%S)
   ```
3. Revert to last stable commit:
   ```bash
   git reset --hard <last-good-commit-hash>
   ```
4. Force push (if already deployed):
   ```bash
   git push origin rollback/emergency-$(date +%Y%m%d-%H%M%S) --force
   ```
5. Rebuild and redeploy:
   ```bash
   pnpm install
   pnpm --filter @workspace/legal-luminaire run build
   ```
6. Restart services

**Rollback Time**: 5 minutes  
**Data Loss**: None (if database unchanged)  
**User Impact**: Moderate (brief downtime)

---

### Method 3: Full System Restore (NUCLEAR - 15 minutes)

**Use When**: Complete system failure

**Steps**:
1. Stop all services:
   ```bash
   # Stop frontend
   pkill -f "vite"
   
   # Stop backend
   pkill -f "uvicorn"
   
   # Stop Neo4j (if running)
   neo4j stop
   ```

2. Restore from backup:
   ```bash
   # Restore codebase
   cd /backup/legal-luminaire-$(date +%Y%m%d)
   cp -r * /path/to/legal-luminaire/
   
   # Restore database
   psql -U postgres -d legal_luminaire < backup.sql
   
   # Restore Neo4j (if applicable)
   neo4j-admin restore --from=/backup/neo4j-backup
   ```

3. Reinstall dependencies:
   ```bash
   pnpm install
   cd artifacts/legal-luminaire/backend
   pip install -r requirements.txt
   ```

4. Restart all services:
   ```bash
   # Start backend
   cd artifacts/legal-luminaire/backend
   python main.py &
   
   # Start frontend
   pnpm --filter @workspace/legal-luminaire run dev &
   
   # Start Neo4j (if applicable)
   neo4j start
   ```

5. Verify system health

**Rollback Time**: 15 minutes  
**Data Loss**: Depends on backup age  
**User Impact**: High (complete downtime)

---

## PRE-ROLLBACK CHECKLIST

Before executing rollback:

- [ ] Document the issue (screenshots, logs, error messages)
- [ ] Notify stakeholders
- [ ] Backup current state (even if broken)
- [ ] Identify rollback method needed
- [ ] Prepare rollback commands
- [ ] Have backup admin available

---

## POST-ROLLBACK CHECKLIST

After rollback execution:

- [ ] Verify all core features working
- [ ] Test citation gate system
- [ ] Test case management
- [ ] Test search functionality
- [ ] Test draft generation
- [ ] Check all protected files intact
- [ ] Review error logs
- [ ] Document root cause
- [ ] Plan fix strategy
- [ ] Notify users of resolution

---

## ROLLBACK TESTING SCRIPT

Run this script to verify rollback success:

```bash
#!/bin/bash
# rollback-test.sh

echo "🔍 Testing Legal Luminaire Rollback..."

# Test 1: Frontend accessible
echo "Test 1: Frontend accessibility..."
curl -f http://localhost:5173 > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Frontend accessible"
else
  echo "❌ Frontend not accessible"
  exit 1
fi

# Test 2: Backend health
echo "Test 2: Backend health..."
curl -f http://localhost:8000/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Backend healthy"
else
  echo "❌ Backend not healthy"
  exit 1
fi

# Test 3: Case context loads
echo "Test 3: Case context..."
curl -f http://localhost:8000/api/cases > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Case context working"
else
  echo "❌ Case context failed"
  exit 1
fi

# Test 4: Search endpoint
echo "Test 4: Search functionality..."
curl -f http://localhost:8000/api/search?q=test > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Search working"
else
  echo "❌ Search failed"
  exit 1
fi

echo "✅ All rollback tests passed!"
```

---

## EMERGENCY CONTACTS

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| System Admin | [Name] | [Email/Phone] | 24/7 |
| Lead Developer | [Name] | [Email/Phone] | Business hours |
| Database Admin | [Name] | [Email/Phone] | On-call |
| Legal Expert | [Name] | [Email/Phone] | Business hours |

---

## BACKUP SCHEDULE

### Automated Backups
- **Code**: Git commits (continuous)
- **Database**: Daily at 2 AM
- **Neo4j**: Daily at 3 AM
- **Configuration**: On every change

### Manual Backups
- Before each deployment
- Before major feature releases
- Before database migrations

### Backup Locations
- **Primary**: `/backup/legal-luminaire/`
- **Secondary**: Cloud storage (S3/Azure)
- **Tertiary**: External drive (weekly)

---

## ROLLBACK HISTORY LOG

| Date | Time | Trigger | Method | Duration | Outcome | Notes |
|------|------|---------|--------|----------|---------|-------|
| - | - | - | - | - | - | - |

---

## LESSONS LEARNED

After each rollback, document:
1. What went wrong?
2. Why wasn't it caught in testing?
3. How can we prevent this in the future?
4. What improvements are needed?

---

## APPENDIX A: Protected Files List

These files MUST remain intact after rollback:

### Frontend
- `artifacts/legal-luminaire/src/App.tsx`
- `artifacts/legal-luminaire/src/main.tsx`
- `artifacts/legal-luminaire/src/index.css`
- `artifacts/legal-luminaire/src/context/CaseContext.tsx`
- `artifacts/legal-luminaire/src/context/AccuracyContext.tsx`
- `artifacts/legal-luminaire/src/lib/citation-gate.ts`
- `artifacts/legal-luminaire/src/lib/verification-engine.ts`
- `artifacts/legal-luminaire/src/lib/case01-data.ts`
- `artifacts/legal-luminaire/src/components/CitationGatePanel.tsx`
- `artifacts/legal-luminaire/src/components/views/SafeDraftEditor.tsx`
- `artifacts/legal-luminaire/src/pages/SafeDraftPage.tsx`
- `artifacts/legal-luminaire/vite.config.ts`

### Backend
- `artifacts/legal-luminaire/backend/main.py`
- `artifacts/legal-luminaire/backend/config.py`
- `artifacts/legal-luminaire/backend/agents/fact_fit_engine.py`
- `artifacts/legal-luminaire/backend/agents/standards_verifier.py`

---

## APPENDIX B: Quick Reference Commands

### Check System Status
```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:8000/health

# Database
psql -U postgres -d legal_luminaire -c "SELECT COUNT(*) FROM cases;"

# Neo4j
cypher-shell "MATCH (n) RETURN count(n);"
```

### View Logs
```bash
# Frontend logs
tail -f artifacts/legal-luminaire/logs/frontend.log

# Backend logs
tail -f artifacts/legal-luminaire/backend/logs/backend.log

# System logs
journalctl -u legal-luminaire -f
```

### Restart Services
```bash
# Restart frontend
pnpm --filter @workspace/legal-luminaire run dev

# Restart backend
cd artifacts/legal-luminaire/backend && python main.py

# Restart all
./scripts/restart-all.sh
```

---

**Document Status**: ✅ APPROVED  
**Last Review**: April 29, 2026  
**Next Review**: May 29, 2026
