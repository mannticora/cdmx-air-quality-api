#!/bin/bash
echo "Waiting for MySQL..."
while ! python3 -c "
import pymysql, sys
try:
    pymysql.connect(
        host='db',
        user='airapi',
        password='airapi123',
        database='cdmx_air_quality',
        connect_timeout=3
    )
    sys.exit(0)
except Exception as e:
    print(e)
    sys.exit(1)
" ; do
  sleep 3
  echo "MySQL not ready, retrying..."
done
echo "MySQL is ready!"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
