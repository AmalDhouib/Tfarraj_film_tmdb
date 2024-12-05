import pandas as pd

# Specify the path to your Excel file
file_path = "movies.xlsx"  # Replace with your actual file path

def extract_movie_names(file_path):
    try:
        # Read the Excel file
        df = pd.read_excel(file_path, engine="openpyxl")

        # Assuming the column containing movie titles is named 'Title'
        if "Title" in df.columns:
            movie_names = df["Title"].dropna().tolist()  # Drop any NaN values and convert to list
            return movie_names
        else:
            print("The column 'Title' does not exist in the Excel file.")
            return []
    except Exception as e:
        print(f"Error reading the Excel file: {e}")
        return []

# Extract movie names
movies = extract_movie_names(file_path)

# Display extracted movie names
if movies:
    print("Extracted Movie Names:")
    for movie in movies:
        print(movie)
else:
    print("No movies found.")
print(movies)