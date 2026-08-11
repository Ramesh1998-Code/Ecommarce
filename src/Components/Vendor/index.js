
import react, { useEffect } from 'react'
import { Button } from 'react-bootstrap'

function Vendor() { 

    const vendorItem = [
        {name:"niraj",email:"niraj123@gmail.com",phone:8770238861 },
        {name:"pankaj",email:"pankajaj321@gmail.com",phone:898989789 },
        {name:"amit",email:"amit1021@gmail.com",phone:901993032 }
    ]

    const addVendor = ()=> {
      vendorItem.push( {name:"kamal",email:"kamal123@gmail.com",phone:785678902 })
      console.log(vendorItem,"vendorItem")
    }
  
    useEffect(()=>{
       
    },[addVendor])

    console.log(vendorItem,"vendor list")

    return (
        <>
            <div className='mt-4 pt-5 box-container container px-5'>
                <div className='text-end'>
                    <Button onClick={()=>addVendor()}>Add Vendor</Button>
                </div>
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                vendorItem?.map((item,key)=>(
                    <tr>
                    <th scope="row">{key}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item?.phone}</td>
                    </tr>
                ))
    }
   
  
  </tbody>
</table>

            </div>
        </>
    )
        
    
}

export default Vendor