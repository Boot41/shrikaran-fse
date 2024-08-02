from node:22 as client_build

WORKDIR /code
COPY ./frontend /code
RUN npm install
RUN npm run build


from python:3.12.3
WORKDIR /code
COPY backend/requirements.txt /code/requirements.txt
RUN pip install gunicorn
RUN pip install -r requirements.txt
COPY --from=client_build /code/dist/assets/ /code/static/
COPY --from=client_build /code/dist/ /code/static/
COPY ./backend /code

CMD ["gunicorn"  , "-b", "0.0.0.0:8000", "backend.wsgi:application"]