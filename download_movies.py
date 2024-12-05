import os
from names import movies

# Download movie function
def download_movie(title):
    # Define the file path
    file_path = f"movies/{title}.mp4"
    
    # Check if the movie already exists
    if os.path.exists(file_path):
        print(f"Skipping: {title} (already exists)")
        return
    
    # If not, proceed to download
    search_url = f"ytsearch:{title} full movie"  # Use YouTube search
    command = f'python -m yt_dlp "{search_url}" -o "{file_path}" --format mp4'
    print(f"Downloading: {title}")
    os.system(command)  # Execute the download command          

# Create a folder to store the movies
os.makedirs("movies", exist_ok=True)

# Download all movies in the list
for movie in movies:
    download_movie(movie)

print("All movies have been processed.")
