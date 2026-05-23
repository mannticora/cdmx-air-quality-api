#!/bin/bash
echo "Waiting for MySQL..."

# Extrae el host de la DATABASE_URL
DB_HOST=$(python3 -c "
import os
from urllib.parse import urlparse
url = os.getenv('DATABASE_URL', '')
if url:
    parsed = urlparse(url)
    print(parsed.hostname)
else:
    print('db')
")

while ! python3 -c "
import pymysql, os, sys
from urllib.parse import urlparse

url = os.getenv('DATABASE_URL', '')
if url:
    parsed = urlparse(url)
    host = parsed.hostname
    user = parsed.username
    password = parsed.password
    db = parsed.path.lstrip('/')
    port = parsed.port or 3306
else:
    host, user, password, db, port = 'db', 'airapi', 'airapi123', 'cdmx_air_quality', 3306

try:
    pymysql.connect(host=host, user=user, password=password, database=db, port=port, connect_timeout=3)
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
