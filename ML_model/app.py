import streamlit as st
import pickle
import pandas as pd
import difflib
import requests



# def fetch_poster(movie_id):
#     # api_key = '5cf515145ae20bf3973820c4798428d5'
#     response = requests.get('https://api.themoviedb.org/3/movie/{}?api_key=5cf515145ae20bf3973820c4798428d5&language=en-US'.format(movie_id))
#     data = response.json()
#     # st.text(data)
#     return "https://image.tmdb.org/t/p/w500/" + data["poster_path"]


def fetch_poster(movie_id):
    try:
        response = requests.get(
            f'https://api.themoviedb.org/3/movie/{movie_id}?api_key=1c3eada27f7905dbdb99dfc0eb2b8ea1&language=en-US',
            timeout=5
        )
        response.raise_for_status()
        data = response.json()
        if "poster_path" in data and data["poster_path"]:
            return "https://image.tmdb.org/t/p/w500/" + data["poster_path"]
    except:
        pass  # Silently fail

    # Return a fallback placeholder
    return "https://via.placeholder.com/500x750?text=No+Image"



# def recommend(movie):
#     try:
#         movie_lower_stripped = movie.lower().strip()
        
#         matches = difflib.get_close_matches(movie_lower_stripped, movies['title'].apply(lambda x: x.lower().strip()))
        
#         if matches:
#             movie_index = movies[movies['title'].apply(lambda x: x.lower().strip()) == matches[0]].index[0]
#             distances = similarity[movie_index]
#             movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[0:6]
#             recommended_movies = []
#             recommended_movies_poster = []
#             for i in movies_list:
#                 movie_id = movies.iloc[i[0]]['movie_id'] # fetch poster using id
#                 recommended_movies.append(movies.iloc[i[0]]['title'])
#                 recommended_movies_poster.append(fetch_poster(movie_id))
#             return recommended_movies, recommended_movies_poster
#         else:
#             st.write("No similar movie found.")
#     except IndexError:
#         st.write("Movie not found in the dataset.")


# movies_dict = pickle.load(open('movie_dict.pkl','rb'))
# movies = pd.DataFrame(movies_dict)

# similarity = pickle.load(open('similarity.pkl','rb'))

# st.title('Movie Recommendation System')

# selected_movie_name = st.selectbox(
#     'A place to find youself....',
#     movies['title'].values
# )

# if st.button('Recommend'):
#     titles, posters = recommend(selected_movie_name)
#     # Create three columns
#     col1, col2, col3, col4, col5, col6 = st.columns(6)

#     # Add content to each column
#     with col1:
#         st.image(posters[0])
#         st.text(titles[0])
#     with col2:
#         st.image(posters[1])
#         st.text(titles[1])
#     with col3:
#         st.image(posters[2])
#         st.text(titles[2])        
#     with col4:
#         st.image(posters[3])
#         st.text(titles[3])
#     with col5:
#         st.image(posters[4])
#         st.text(titles[4])
#     with col6:
#         st.image(posters[5])
#         st.text(titles[5])

def recommend(movie):
    try:
        movie_lower_stripped = movie.lower().strip()
        
        matches = difflib.get_close_matches(movie_lower_stripped, movies['title'].apply(lambda x: x.lower().strip()), n=1, cutoff=0.6)
        
        if matches:
            matched_movie = matches[0]  # Closest match
            movie_index = movies[movies['title'].apply(lambda x: x.lower().strip()) == matched_movie.lower()].index[0]
            distances = similarity[movie_index]
            movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[0:12]

            recommended_movies = []
            recommended_movies_poster = []
            for i in movies_list:
                movie_id = movies.iloc[i[0]]['movie_id']
                recommended_movies.append(movies.iloc[i[0]]['title'])
                recommended_movies_poster.append(fetch_poster(movie_id))
            return recommended_movies, recommended_movies_poster
        else:
            st.write("No similar movie found. Try a different name.")
            return [], []
    except IndexError:
        st.write("Movie not found in the dataset.")
        return [], []

# Load data
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl', 'rb'))

st.title('Movie Recommendation System')

# Custom Styling
st.markdown(
    """
    <style>
        body { background-color: #121212; color: white; }
        .stTextInput>div>div>input {
            font-size: 22px !important; height: 50px !important; text-align: center;
        }
        .stButton>button { font-size: 20px !important; padding: 12px 24px; }
        .stImage img { border-radius: 15px; }
        .movie-title { text-align: center; font-size: 18px; font-weight: bold; }
    </style>
    """,
    unsafe_allow_html=True
)

# Title
# st.markdown("<h1 style='text-align: center; font-size: 48px; color: #FF4B4B;'>Movie Recommendation System</h1>", unsafe_allow_html=True)

# Text input instead of dropdown
selected_movie_name = st.text_input("Enter a movie name:", "")

# Recommendation button
if st.button('🎬 Recommend'):
    if selected_movie_name.strip():  
        titles, posters = recommend(selected_movie_name)
        
        if titles:
            num_movies = len(titles)
            cols_per_row = 4
            rows = (num_movies // cols_per_row) + (num_movies % cols_per_row > 0)

            for row in range(rows):
                cols = st.columns(cols_per_row)
                for col_idx in range(cols_per_row):
                    movie_idx = row * cols_per_row + col_idx
                    if movie_idx < num_movies:
                        with cols[col_idx]:
                            try:
                                st.image(posters[movie_idx], width=180)
                            except:
                                st.image("https://via.placeholder.com/500x750?text=No+Image", width=180)
                            st.markdown(f"<p class='movie-title'>{titles[movie_idx]}</p>", unsafe_allow_html=True)

    else:
        st.warning("⚠ Please enter a movie name.")