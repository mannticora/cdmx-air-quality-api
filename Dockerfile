# Imagen base de Python 3.11
FROM python:3.11-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias primero
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Puerto que expone la API
EXPOSE 8000

# Comando para arrancar la API
CMD ["./wait-for-db.sh"]
