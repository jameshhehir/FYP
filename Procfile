release: python fyp/manage.py migrate
web: gunicorn fyp.fyp.wsgi:application --log-file - --log-level debug
