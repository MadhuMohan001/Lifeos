# LifeOS
React + TS + Tailwind + Capacitor + SQLite. Implemented so far: Home, Daily Planner (CRUD, statuses, priorities, carry-forward, completion %, default timetable).
## Get the APK
1. Create a GitHub repo, push this folder to `main`.
2. Actions tab -> "Build Android APK" -> open the run -> download artifact `lifeos-debug-apk`.
3. Unzip, copy `app-debug.apk` to your phone, open it, allow "Install unknown apps" when asked.
## Local
`npm install && npm run sync && cd android && ./gradlew assembleDebug` (needs JDK 17 + Android SDK).
