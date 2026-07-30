import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal";

function Table() {
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null)
    const [showModal,setShowModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null);
    useEffect(()=>{
        const fetchUser = async () =>{
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/users");
                setUsers(response.data);
            } catch(err){
                setError("something went wrong");
            } finally {
                setLoading(false);
            }

        };
        fetchUser()
    },[])
  
    if(loading) return <p>loading</p>
    if(error) return <p>{error}</p>;

    const handleDelet = (id)=>{
      setDeleteId(id);
      setShowModal(true);
    }
    const confirmDelete = () =>{
        const updateUser = users.filter((item)=> item.id !==deleteId)
        setUsers(updateUser);
        setShowModal(false);
        setDeleteId(null)
    }
    
    return (
        <div>
          
            <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Username</th>
          <th>website</th>
           <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {
            users.map((item)=>(
                 <tr>
          <td>
            <span>{item.id}</span>
          </td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.username}</td>
          <td>{item.website}</td>
          <td  onClick={()=>handleDelet(item.id)}>Delete</td>
        </tr>
            ))
        }
      </tbody>
    </table>
            </div>
            {showModal && ( 
                <Modal confirmDelete={confirmDelete} handleDelet={handleDelet} showModal={showModal} setShowModal={setShowModal} />
            )}
            
        </div>
    )
    }

export default Table