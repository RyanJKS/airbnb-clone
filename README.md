# Airbnb Clone

## Description

This project is a full-stack Airbnb clone built with Next.js for the frontend and Django for the backend. It demonstrates a simple rental listing application with user authentication, property listings, and booking functionalities.

## Features

- User authentication and authorization
- Property listings with details and images
- Booking functionality
- Responsive design

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- CSS Modules

### Backend

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

## Installation

### Prerequisites

- Node.js
- Python 3.x
- pip (Python package installer)
- virtualenv (Python virtual environment tool)

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/airbnb-clone.git
    cd airbnb-clone
    ```

2. **Backend Setup**

    ```bash
    cd backend
    virtualenv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

3. **Frontend Setup**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4. **Access the application**

    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:8000`

## Contributing

Feel free to open an issue or submit a pull request if you have any improvements or suggestions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

