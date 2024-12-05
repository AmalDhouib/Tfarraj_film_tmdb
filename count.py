import os

# Remplacez par le chemin de votre dossier 'movies'
folder_path = r"C:\Users\21697\OneDrive\Bureau\node\movies"

# Compter les fichiers
movie_count = len([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])

print(f"Nombre de films dans le dossier 'movies' : {movie_count}")
