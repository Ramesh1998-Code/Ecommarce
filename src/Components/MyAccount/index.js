import React, { useState } from 'react'
 import { ToastContainer, toast } from 'react-toastify';
function MyAccount() {
const [user,setUser] = useState({
    firstName:"jhon",
    lastName:"doe",
    email:"johndoe@example.com",
    phone:"+1 234 567 890",
    address:"123 Main Street, City, Country"
})
     const [isEditing,setIsEditing] = useState(false);
     const notify = () => toast("Profile update Successfully", {
           theme: "dark",
         });
 const handleEdit = ()=>{
    if(isEditing) {
       
        setIsEditing(false);
        notify();
    }
    else {
        setIsEditing(true);
    }
    
 }

 const handleOnchange = (e)=> {
    if(!isEditing) return;
    const { name,value} = e.target;
    setUser(prev=>({
        ...prev,
        [name]:value
    }))
 }

  console.log("user",user);
  

  return (
    <div className='container mb-4 mt-5 pt-5 pb-5'>
          <ToastContainer theme="light" />
        <h2 className='text-center'>My Account</h2>
        <div class="account-container">
    <div class="account-header">
        <img src="https://via.placeholder.com/101" alt="Profile Picture" />
        
        <h2>{user.firstName} {user.lastName}</h2>
        <p className='text-white'>{user.email}</p>
    </div>
    <div class="account-body">
        <div class="account-section">
            <h3>Personal Information</h3>
            <div class="account-info">
                <div>
                    <label>Full Name</label>
                   
                   <input type="text" value={user.firstName || ''} name='firstName' onChange={(e)=>handleOnchange(e)} disabled={!isEditing} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={user.email || ''} name='email' onChange={(e)=>handleOnchange(e)} disabled={!isEditing} />
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" value={user.phone || ''} name='phone' onChange={(e)=>handleOnchange(e)} disabled={!isEditing} />
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" value={user.address || ''} name='address' onChange={(e)=>handleOnchange(e)} disabled={!isEditing} />
                </div>
            </div>
        </div>

        <div class="account-section">
            <h3>Account Settings</h3>
            <a onClick={handleEdit} class="btn"> {isEditing ? 'Save Changes' : 'Edit Profile'}</a>
            <a href="#" class="btn">Change Password</a>
        </div>
    </div>
</div>
    </div>
  )
}

export default MyAccount
