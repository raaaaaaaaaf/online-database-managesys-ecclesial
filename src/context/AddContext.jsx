import { nanoid } from "nanoid";
import { createContext, useState } from "react";


export const AddFormContext = createContext();

export function AddFormProvider ({children}) {
    const [docId, setDocId] = useState("");
    const [formData, setFormData] = useState({
    // Step1
        born: "",
        childName: "",
        church: "",
        dob: "",
        dobaptized: "",
        parent1: "",
        parent2: "",
        rev: "",
        sponsor1: "",
        sponsor2: "",
        sponsor3: "",
        sponsor4: "",
        isPaid: false,
        price: 120,
        docName: "Baptismal Certificate",
    })
    const [formData1, setFormData1] = useState({
        age: "",
        cod: "",
        docName: "Burial Certificate",
        docType: "Burial",
        dod: "",
        fullName: "",
        gender: "",
        isPaid: false,
        marital: "",
        occupation: "",
        price: 120,
        
    })

    const [formData2, setFormData2] = useState({
        fullName: "",
        father: "",
        mother: "",
        dob: "",
        pob: "",
        marital: "",
        address: "",

        fullName1: "",
        father1: "",
        mother1: "",
        dob1: "",
        pob1: "",
        marital1: "",
        address1: "",

        isPaid: false,
        price: 120,
        docName: "Marriage Certificate",
    })
    return (
        <AddFormContext.Provider value={{formData, setFormData, docId, setDocId, formData1, setFormData1, formData2, setFormData2}}>
            {children}
        </AddFormContext.Provider>
    )
}