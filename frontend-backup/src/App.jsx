import React, {useState} from 'react';
import ProfileForm from './components/ProfileForm';
import ImageUpload from './components/ImageUpload';

export default function App(){
  const [uid,setUid] = useState(null);
  return(
    <div>
      <h1>AI Fitness System</h1>
      {!uid ? <ProfileForm onDone={setUid}/> : <ImageUpload userId={uid}/>}
    </div>
  );
}
