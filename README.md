# Buzz Market

## Summary


The Buzz Market project aims to create a comprehensive web application that facilitates the buying and selling of goods for Georgia Tech students. The marketplace is designed to be responsive and interactive, providing a seamless experience across different devices.

By enabling students to list and browse items within a verified ecosystem, we hope to foster a sense of trust and enhance on-campus commerce. The marketplace addresses common pain points such as inefficient communication, lack of transparency, and accessibility issues in existing informal trading platforms. While existing platforms like Facebook Marketplace, Craigslist, and OfferUp serve similar purposes, Buzz Market differentiates itself by tailoring its functionality to the needs of Tech students.

Flask in Python was used to create a RESTful backend API, ensuring robust communication pathways with Google Cloud Firestore, a NoSQL database, and Google Cloud Storage buckets for hosting images. Google Cloud Platform and App Engine serve as a scalable backend infrastructure. The frontend was developed using React, combined with HTML, CSS, and JavaScript to create a dynamic and interactive user interface. Bootstrap was integrated as a frontend library to streamline the design process. GitHub and VSCode were used as development tools to ensure version control and a smooth coding environment.

### Component Diagram
![image](https://github.com/user-attachments/assets/65e400f2-bd1c-4e98-8932-8425e44f0fc9)

### Deployment Diagram
![image](https://github.com/user-attachments/assets/fab59683-c1f4-4ec3-9501-2c2497380bd2)

## Release Notes
v. 1.0.0

### New Software Features
- Login/Signup
- Create Listings with Images
- Sort, Filter, and Search Listings
- View Listing Details
- Add Listings to Watchlist
- Chatbox Page for User-to-User Communication

### Resolved Bugs
- Fixed the main page shrinking when there are no listings
- Fixed having unlimted cards per row on larger screens
- Fixed dates and times not being displayed correctly
- Fixed Chat not updating in real-time

### Known Bugs
- Some image types (.HEIC, .webp) are not displayed correctly

## Install Guide

### Pre-requisites
- Node.js
- npm
- Python
- pip
- VSCode (or any IDE that supports React and Python)

### Dependent Libraries
The following libraries are required to run the project.
They all are either included in the project or can be installed using `pip install`.
- React
- Bootstrap
- Flask
- Flask-CORS
- PyJWT
- Google Cloud Storage
- Firebase Admin

### Download Instructions
To download the project, clone the repository and navigate to the front-end and back-end directories.

```
git clone https://github.com/jjones634/cs3300proj2group11.git
```

### Installation of Actual Application

#### Frontend
Navigate to the frontend directory.
```
cd frontend
```

In the frontend directory, run the following to install dependencies:
```
npm install
```

#### Backend
1. Navigate to the backend directory
```
cd backend
```
2. Run the following command to setup a virtual environment

```
python3 -m venv venv
```

3. Activate the virtual environment

##### On Mac/Linux
```
source venv/bin/activate
```

##### On Windows
First, check that your PowerShell execution policy
is not Restricted. To do so, run the following command:
```
Get-ExecutionPolicy
```
If it is Restricted, you need to follow the following steps:

1. Run PowerShell as Administrator

2. In the PowerShell window that you have opened, run:
```
Set-ExecutionPolicy RemoteSigned
```
3. Confirm the change

Once your PowerShell execution policy is set to RemoteSigned,
run the following command:
```bash
venv\Scripts\activate
```

You should see `(venv)` in the terminal prompt.

4. Install the dependencies
```
pip install -r requirements.txt
```

### Run Instructions

#### Frontend
In the front-end directory, run the following to start the development server:
```
npm run dev
```

Navigate to [http://localhost:5173/](http://localhost:5173/) to view the website.

#### Backend

In the backend directory, while the virtual environment is activated, run the following to start the development server:
```
python app.py
```

### Troubleshooting
If you have issues in the backend, try reinstalling the dependencies.
If issues persist, try reinstalling the virtual environment.
