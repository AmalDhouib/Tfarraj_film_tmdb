import os

folder_path = r"C:\Users\21697\OneDrive\Bureau\node\movies"

movie_count = len([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])

print(f"Nombre de films dans le dossier 'movies' : {movie_count}")
