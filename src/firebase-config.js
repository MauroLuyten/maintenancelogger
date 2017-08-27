import Firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDe-jSD6qqbpK_CZ1uAH3DWcPt8JDWuoGs",
  authDomain: "maintenancelogger.firebaseapp.com",
  databaseURL: "https://maintenancelogger.firebaseio.com",
  projectId: "maintenancelogger",
  storageBucket: "maintenancelogger.appspot.com",
  messagingSenderId: "73510925424"
}
export const firebaseApp = Firebase.initializeApp(config)
export const database = firebaseApp.database()