from flask import Flask, request, jsonify, render_template
import os
import requests

app = Flask(__name__)


API_KEY = 'AIzaSyCpiA3eLjzC6TE7l0fVnQcuJPqv3jqVLFE'

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/search')
def search_books():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Invalid search query'})


    url = f'https://www.googleapis.com/books/v1/volumes?q={query}'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        books = []
        for item in data.get('items', []):
            book = {
                'id': item['id'],
                'title': item['volumeInfo'].get('title', 'N/A'),
                'authors': item['volumeInfo'].get('authors', ['N/A']),
                'description': item['volumeInfo'].get('description', 'N/A'),
                'imageLinks': item['volumeInfo'].get('imageLinks', {}).get('smallThumbnail', '')
            }
            books.append(book)
        return jsonify({'items': books})
    else:
        return jsonify({'error': 'Failed to fetch search results'})



@app.route('/api/books/<book_id>')
def get_book(book_id):
    if not API_KEY:
        return jsonify({'error': 'Google Books API key is missing'}), 500

    try:
        response = requests.get(f'https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}')
        response.raise_for_status()
        data = response.json()

      
        book = {
            'id': data['id'],
            'title': data['volumeInfo'].get('title', ''),
            'authors': data['volumeInfo'].get('authors', []),
            'description': data['volumeInfo'].get('description', ''),
            'image': data['volumeInfo'].get('imageLinks', {}).get('thumbnail', ''),
        }

        return jsonify(book)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):

    return jsonify({'message': f'Book with ID {book_id} deleted from library'})

if __name__ == '__main__':
    app.run(debug=True)
