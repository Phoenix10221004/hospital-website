import { useState } from "react";
import { Stack, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { arrowClick } from '../../redux/action/hospitalAction';
import Upload from '../upload'
import './index.css'
import './index.css';
import { Translate } from "@mui/icons-material";
import axios from 'axios';


const Title = styled('div')({
  fontSize: '16px',
  fontWeight: '500',
  paddingTop: '20px',
  textAlign: 'left',
  width: '100%'
})

const ButtonStyle = styled('button')({
  fontSize: '18px',
  background: '#fb771a',
  color: 'white',
  borderRadius: '10px',
  marginTop: '40px',
  '&:hover': {
    background: 'dodgerblue',
    transform: 'translateY(-5px)'
  },
  width: '100%',
  border: 'none',
  padding: '10px 20px',
  // width:'300px',
  transition: '0.4s',
  marginLeft: '10px'
})

const Register = () => {
  const [avatar, setAvatar] = useState<any>();
  const [name, setName] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const patientRegister = async (e: any) => {
    try {
      // e.preventDefault();
      if (name && birthday && phone && email.indexOf("@") != -1 && address) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('name', name);
        formData.append('birthday', birthday);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);
        await axios({
          method: 'post',
          url: 'http://192.168.104.228:8000/api/person/create',
          data: formData,
        })
          .then(function (response: any) {
            if (response.status === 200) {
              toast("Register Success!", { position: "top-right", type: "success" });
              console.log("success:::", true);
              console.log("response:::", response);
            }
          })
          .catch(function (err: any) {
            console.log("err::", err);
          })
      }
      else if (email.indexOf("@") === -1 || !name || !birthday || !phone || !address) {
        toast("Input in the fields correctly", { position: "top-right", type: "error" });
      }
    }
    catch (error: any) {
      console.log("error", error);
      toast(error?.error?.data.message || error.message, { position: "top-right", type: "error" });
    }



  }
  return (
    <>
      <form onSubmit={e => e.preventDefault()}
        className='register'
      >
        <Stack direction='row' justifyContent={'center'} ><Upload avatar={avatar} setAvatar={setAvatar} /></Stack>
        <Title>Name</Title>
        <input required type="text" value={name} placeholder="Name" name="name" onChange={(e: any) => setName(e.target.value)} />
        <Title>Birthday</Title>
        <input required type="date" value={birthday} placeholder="Birthday" name="birthday" onChange={(e: any) => setBirthday(e.target.value)} />
        <Title>Phone Number</Title>
        <input required type="tel" value={phone} placeholder="Phone Number" name="phone number" onChange={(e: any) => setPhone(e.target.value)} />
        <Title>Email</Title>
        <input required type="email" value={email} placeholder="your-email@gmail.com" name="email" onChange={(e: any) => setEmail(e.target.value)} />
        <Title>Address</Title>
        <input required type="text" value={address} placeholder="Address" name="address" onChange={(e: any) => setAddress(e.target.value)} />
        <ButtonStyle onClick={patientRegister}>Register</ButtonStyle>
      </form>
    </>
  );
}

export default Register;