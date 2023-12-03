import { addDoc, collection } from "@firebase/firestore"
import { db } from "../firebase"
import {doc, setDoc} from "firebase/firestore";

const handleSubmit = async (username,name,type) => {
    const loginRef = collection(db, "login") // Firebase creates this automatically


    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().split('T')[0];

    console.log("Hey we are here")
    try {
        await setDoc(doc(loginRef, username), {
            name: name,
            timeOfLogin: formattedDate,
            typeOfuser : type
        });
    } catch (e) {
        console.log(e)
    }
}

export default handleSubmit