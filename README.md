
# Employee Manager App

This is a website where user can do following operations:
1. Admin can do CRUD operation on employee details.
2. Manager can view employee details & do CRUD operation on only the employee from their department.
3. Employee logs in & can see their details.
4. Email sent to employees when their details updated.
5. Audit log gets updated when user's detail gets updated.

# Things Couldn't Integrate Due to timeconstraints

1. Google Calender & sent notification as according.
2. Dark Mode.
3. Cloudinary integration not working as from frontend object is being sent not the URL tried many times to fix that but couldn't fix that.


## Installation

First fork the repo.

To run this project locally you've to do the following


```bash
  git clone https://github.com/SowmikDey/empmanagement.git
  cd empmanagement
```

To run frontend do the following

```bash
  cd frontend
  npm i
  npm run dev
```
    
To run backend open another terminal & do the following 

Make Sure you've nodemon installed

```bash
  cd backend
  npm i
  nodemon server.js
```

# CREATE .env FILE IN BACKEND & PUT THE FOLLOWING DETAILS

DATABASE_URL="postgresql://postgres:Messi10@localhost:5432/Emp-Manager?schema=public"

PORT = 8383

JWT_SECRET = "secret"

NODE_ENV = "development"

CLOUDINARY_CLOUD_NAME = dw26qy0m9

CLOUDINARY_API_KEY = 823185648553476

CLOUDINARY_API_SECRET = sHKjOgadv_YsRyL6pPsuMH0FkBE

APP_PASSWORD = "wyeceloojdsguutu"

# For Testing 

In Sign-In fill up these details

For Admin 
Position : Admin

Admin Account
```bash
email: sowmikdey23@gmail.com
password: 123456
```
For Manager
Position : Manager

Manager Account
```bash
email: leo10@gmail.com
password: 123456
```

For Employee
Position : Anything you want doestn't matter

```bash
email: abcd@gmail.com
password: 123456
```
