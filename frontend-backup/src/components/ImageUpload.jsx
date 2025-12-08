import React,{useState} from 'react';

export default function ImageUpload({userId}){
  const [file,setFile]=useState();
  const [res,setRes]=useState();

  const upload=async(e)=>{
    e.preventDefault();
    const f=new FormData();
    f.append("image",file);
    f.append("user_id",userId);
    const r=await fetch('http://localhost:5000/upload-image',{method:'POST',body:f});
    setRes(await r.json());
  }

  return(
    <div>
      <form onSubmit={upload}>
        <input type="file" onChange={e=>setFile(e.target.files[0])}/>
        <button>Upload</button>
      </form>
      {res && <pre>{JSON.stringify(res,null,2)}</pre>}
    </div>
  );
}
