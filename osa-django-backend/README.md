cd osa-django-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with secret keys
python manage.py migrate
python manage.py createsuperuser
mkdir -p media/partnership_images
python manage.py runserver