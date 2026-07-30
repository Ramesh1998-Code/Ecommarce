import React, { useState } from 'react'
import { jsPDF } from "jspdf";
function Pdf() {
        const [formData,setFormData] = useState({
            firstName:"",
            lastName:"",
            email:"",
            address:""
        })

        const handleOnchange = (e) =>{
             const {name,value} = e.target;
             setFormData(prev =>({
                ...prev,
                [name]:value
             }));
        }

        function emptyValue(){
            return Object.values(formData).every(v => v.trim() === "");
    
        }
        
        
        const clear = ()=>{
            const isEmpty = emptyValue();
          
            
            if(isEmpty){
                alert("please enter somting")
            }
            else{
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    address: ""
                });
            }
           
        }


        const generatePdf = () => {
             const isEmpty = emptyValue();
            if(isEmpty) {
               alert("fisrt enter something then genrate pdf");

            }
            else{
                const doc = new jsPDF();
                doc.text(`Name: ${formData.firstName}`, 10, 10);
                doc.text(`Last Name: ${formData.lastName}`, 10, 20);
                doc.text(`Email: ${formData.email}`, 10, 30);
                doc.text(`Address: ${formData.address}`, 10, 40);
                doc.save(`${formData.firstName}_download-pdf`);
            }
       
        };
  return (
    <div>
        <div>
            <h2>PDF Generator</h2>
            <input name="firstName"  value={formData.firstName || ''} onChange={handleOnchange} placeholder="Enter Name" />
            <br/>
            <input name="lastName"  value={formData.lastName|| ''}  onChange={handleOnchange} placeholder="Last Name" />
             <br/>
            <input name="email" value={formData.email || ''} onChange={handleOnchange} placeholder="Enter Email" />
             <br/>
            <input name="address"  value={formData.address || ''} onChange={handleOnchange} placeholder="Enter Address" />
             <br/>
            <button onClick={generatePdf}>Generate PDF</button>
            <button onClick={clear}>clear Data</button>
        </div>
    </div>
  )
}

export default Pdf