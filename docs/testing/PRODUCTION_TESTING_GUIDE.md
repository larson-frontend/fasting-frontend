# Production Testing Guide - Fasting App

#### Check Data Persistence
1. **User Preferences**
	- Make changes in UI
	- Verify data in database
	- Check if changes survive backend restart

2. **Fasting Sessions**
	- Create fasting sessions
	- Verify database storage
	- Check data integrity

### 5. Known Limitations (Current State)

#### Authentication
- Using temporary `userId=1` parameter instead of full JWT
- 403 errors expected for direct API calls without proper headers
- Frontend should handle authentication flow properly

#### Database
- PostgreSQL required for full functionality
- Check if migrations have been applied
- Verify all required tables exist

## Quick Start Commands

### Start Backend
```bash
cd /home/lars/Projects/FASTING-APP/fasting-service
java -jar target/fasting-service-0.0.1-SNAPSHOT.jar --server.port=8081 &
```

### Start Frontend
```bash
cd /home/lars/Projects/FASTING-APP/fasting-frontend
npm run dev
```

### Run Tests
```bash
cd /home/lars/Projects/FASTING-APP/fasting-frontend
npm test
```

## Troubleshooting

### Common Issues
1. **Port 8081 in use**: Kill existing process or use different port
2. **Database connection issues**: Check PostgreSQL service
3. **CORS errors**: Verify backend CORS configuration
4. **404 on API calls**: Check API base URL configuration

### Debug Commands
```bash
# Check backend process
ps aux | grep fasting-service

# Check port usage
netstat -tlnp | grep 8081

# View backend logs
tail -f /path/to/backend/logs

# Check frontend dev server
curl http://localhost:5173
```

## Success Criteria

### ✅ Minimum Viable Production Test
- [ ] Frontend loads without errors
- [ ] User can navigate between pages
- [ ] User Settings page shows user data
- [ ] Save Changes button triggers API call
- [ ] No "No User logged in" errors
- [ ] Basic fasting functionality works

### ✅ Full Feature Test
- [ ] Complete user authentication flow
- [ ] All CRUD operations work
- [ ] Data persists across sessions
- [ ] All major features functional
- [ ] Performance acceptable
- [ ] No console errors

## Next Steps After Testing
1. Document any issues found
2. Prioritize fixes for production release
3. Set up proper JWT authentication
4. Configure production database
5. Set up deployment pipeline

