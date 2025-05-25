# Εφαρμογή Κράτησης Τραπεζιών σε Εστιατόριο

Αυτό το project υλοποιεί μια εφαρμογή κράτησης τραπεζιών σε εστιατόρια, όπως ζητείται στην εργασία του μαθήματος **CN6035 - Mobile & Distributed Systems**.

Η εφαρμογή περιλαμβάνει:
- **Frontend**: Δημιουργημένος με React.js (web app)
- **Backend**: Node.js + Express API (RESTful endpoints)
- **Database**: MariaDB (χρησιμοποιείται για αποθήκευση δεδομένων
- **Ασφάλεια**: JWT Authentication + Bcrypt (κρυπτογράφηση κωδικών)
- **Διαχείριση Έκδοσης**: Git + GitHub

---

## 🔧 Περιγραφή Λειτουργικότητας

### ✅ Frontend
- Αρχική σελίδα με λίστα εστιατορίων
- Μοντέλο εγγραφής / σύνδεσης χρήστη με validation
- Φόρμα κράτησης: επιλογή ημερομηνίας, ώρας, αριθμού ατόμων
- Προβολή, επεξεργασία και διαγραφή κρατήσεων

### ✅ Backend
- REST API με τα εξής endpoints:
  - `/auth/register` – Εγγραφή χρήστη
  - `/auth/login` – Σύνδεση χρήστη + επιστροφή JWT token
  - `/restaurants` – Επιστροφή λίστας εστιατορίων
  - `/reservations` – Δημιουργία, ενημέρωση, διαγραφή κρατήσεων
  - `/user/reservations` – Εμφάνιση κρατήσεων του χρήστη
- Χρήση JWT για authentication
- Αποθήκευση κωδικών με bcrypt (hashing)
- Υποστήριξη middleware για validation requests

### ✅ Database (MariaDB)
Έχει τους εξής πίνακες:
- `users`: Για τη διαχείριση των χρηστών
- `restaurants`: Για τη διαχείριση των εστιατορίων
- `reservations`: Για τη διαχείριση των κρατήσεων

> Το SQL script για δημιουργία πινάκων είναι διαθέσιμο στο `database/schema.sql`.

---

## 📁 Δομή Φακέλων

RestaurantReservationApp/
│
├── frontend/ # Βασικός φάκελος frontend
│ ├── public/ # Στατικά αρχεία (όπως εικόνες)
│ ├── src/ # Αρχικός κώδικας
│ │ ├── components/ # Reusable components (buttons, forms, layout)
│ │ ├── pages/ # Σελίδες (Home, Login, Register, Reservations)
│ │ ├── hooks/ # Custom hooks (useAuth, useFetch)
│ │ └── App.jsx # Κυρίως δομή frontend
│ │
│ └── package.json # Scripts και βιβλιοθήκες frontend
│
├── backend/ # Node.js + Express backend
│ ├── routes/ # API endpoints
│ ├── controllers/ # Λογική για κάθε endpoint
│ ├── models/ # Μοντέλα για επικοινωνία με τη βάση δεδομένων
│ ├── middleware/ # JWT validation, authentication
│ ├── config/ # Ρυθμίσεις database και tokens
│ └── server.js # Αρχείο που τρέχει το backend
│
├── database/
│ └── schema.sql # SQL script για δημιουργία πινάκων (users, restaurants, reservations)
│
└── README.md # Αυτό το αρχείο


---

## 🧪 Πώς να Ξεκινήσετε την Εφαρμογή

### 1. Για το **Frontend**

Πριν ξεκινήσετε, βεβαιωθείτε ότι έχετε εγκατεστημένο το `npm`.

```bash
cd frontend
npm install
npm run dev

2. Για το Backend

Βεβαιωθείτε ότι έχετε εγκατεστημένο το node και το npm.

cd backend
npm install
node server.js

Το backend τρέχει στο http://localhost:5000 

🌐 REST API Endpoints

POST
/auth/register
Εγγραφή νέου χρήστη
,
POST
/auth/login
Σύνδεση χρήστη
, 
GET
/restaurants
Λίστα εστιατορίων
, 
POST
/reservations
Δημιουργία κράτησης
, 
GET
/user/reservations
Εμφάνιση κρατήσεων χρήστη
, 
PUT
/reservations/:id
Ενημέρωση κράτησης
, 
DELETE
/reservations/:id
Διαγραφή κράτησης

🗂️ Βάση Δεδομένων (MariaDB)
Πίνακες:
users
-
user_id (primary key)
name
email (unique)
password_hash (κρυπτογραφημένος κωδικός)
--
restaurants

restaurant_id (primary key)
name
location
description
--
reservations

reservation_id (primary key)
user_id (foreign key → users.user_id)
restaurant_id (foreign key → restaurants.restaurant_id)
date
time
people_count
--
Το αρχείο database/schema.sql περιλαμβάνει το SQL script για τη δημιουργία της βάσης. 

🧪 Πώς να Δοκιμάσετε την Εφαρμογή
Για το Backend:
Μπορείτε να δοκιμάσετε τα API endpoints με Thunder Client (VS Code extension) ή Postman.
Παραδείγματα:
Εγγραφή χρήστη



POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
Σύνδεση χρήστη



POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
Η απάντηση θα περιλαμβάνει JWT token, τον οποίο μπορείτε να χρησιμοποιήσετε στα protected routes. 


🧠 Σημειώσεις
Η εργασία δεν χρησιμοποιεί React Native, αλλά React.js — είναι αποδεκτό, καθώς η εφαρμογή είναι responsive και μπορεί να χρησιμοποιηθεί από mobile συσκευές.
Υποστηρίζεται ασφαλής authentication με JWT tokens και bcrypt για hashing κωδικών.
Ο backend επικοινωνεί με MariaDB database για αποθήκευση και ανάκτηση πληροφοριών.

📝 Πώς να ξεκινήσετε το project
1.Κατεβάστε το project

git clone https://github.com/JamesNas/RestaurantReservationApp.git 

2.Τρέξτε το Backend

cd RestaurantReservationApp/backend
npm install
node server.js

3.Τρέξτε το Frontend

cd ../frontend
npm install
npm run dev

4.Δοκιμάστε την εφαρμογή

Κάντε register ή login
Κάντε κράτηση σε εστιατόριο
Δείτε τις κρατήσεις σας και δοκιμάστε να τις τροποποιήσετε ή να τις διαγράψετε

💬 Υποστήριξη & Βοήθεια
Αν έχετε οποιοδήποτε πρόβλημα με την εγκατάσταση ή τη λειτουργία:

Επικοινωνήστε μαζί μου στο email: james@yourdomain.gr
Ή δημιουργήστε issue στο GitHub repo
