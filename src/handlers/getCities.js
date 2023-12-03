import { doc, getDoc } from "firebase/firestore";
import handleMsg from "./handleMsg";
import {db} from "../firebase";
const getCities = async (testdata) => {

    const docRef = doc(db, "cities", "SF");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}
export default getCities;