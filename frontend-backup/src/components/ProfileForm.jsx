import React,{useState} from 'react';

export default function ProfileForm({onDone}){
  const [data,setData]=useState({name:'',age:20,gender:'male',height_cm:170,weight_kg:65,activity_level:'sedentary',goal:'maintain',experience:'beginner'});
  const send=async(e)=>{
    e.preventDefault();
    const r=await fetch('http://localhost:5000/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const j=await r.json(); onDone(j.id);
  }
  return(
    <form onSubmit={send}>
      <input placeholder="Name" onChange={e=>setData({...data,name:e.target.value})}/>
      <button>Create</button>
    </form>
  );
}
