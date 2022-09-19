import * as React from 'react';
import { useState, useEffect } from 'react';
import { IconButton, Stack } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar }from '@mui/material'
import { useSelector } from 'react-redux'
import axios from 'axios';
import {styled} from '@mui/material/styles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export const ITEMS_PER_PAGE = 7

const HeaderTableCell = styled(TableCell)({
  transitionDuration: '1s',
  cursor:'pointer',
  backgroundColor:'LightGray',
  border: '1px solid white',
  color:'white',
  '&:hover':{
    backgroundColor:'#fb771a'
  }
})

const PageLabl = styled('input')({
  backgroundColor:'#fb771a',
  color:'white !important',
  fontSize:'14px !important',
  border:'none !important',
  padding:'5px 10px',
  width:'120px',
  textAlign:'center'
})

function createData(
  avatar: string,
  name: string,
  birthday: string,
  phonenumber: string,
  email: string,
  address: string,
) {
  return { avatar, name, birthday, phonenumber, email, address };
}

export default function HospitalTable() {
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(10);
  const [personInfo, setPersonInfo] = useState<any>([]);

  const handlePage = (event: any) => {
    setPage(event.target.value);
  }

  const arrowLeft = () => {
    if(page > 1) setPage(page-1);
    else if(page === 1) setPage(1);
  }

  const arrowRight = () => {
    if(page < maxPage) setPage(page+1);
    else if(page === maxPage) setPage(maxPage);
  }

  const fetchPersonData = async () => {
    try{
      const response = await axios.get('http://192.168.104.228:8000/api/person/admin',
        { params: {type: 'All'} })
      setPersonInfo(response.data);
      let mod  ;
      mod = response.data.length / 7;
      setMaxPage(Math.ceil(mod));
    }
    catch(err){
      console.log("Error:::", err);
    }
  }

  const rowDelete = async (personId: any) => {
    try{
      const response = await axios.delete('http://192.168.104.228:8000/api/person/delete',{
        params: {id: personId}
      })
      if(response.status === 200){
        window.location.reload(); 
      }
    }
    catch(err){
      console.log("delete failured!", err)
    }
  }

  const sort = async (sortType: string) => {
    try{
      const response = await axios.get('http://192.168.104.228:8000/api/person/sort',{
        params: {type: sortType}
      })
      if(response.status === 200){
        setPersonInfo(response.data.data);
      }
    }
    catch(err){
      console.log("sort_error", err);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchPersonData();
    })();    
  },[])

  return (
    <TableContainer sx={{position:'relative',width:"70%", margin:'50px auto'}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <HeaderTableCell  sx={{fontSize:'18px'}}>Avatar</HeaderTableCell>
            <HeaderTableCell onClick={() => sort('name')} sx={{fontSize:'18px'}} align="right">Name</HeaderTableCell>
            <HeaderTableCell onClick={() => sort('birthday')} sx={{fontSize:'18px'}} align="right">Birthday</HeaderTableCell>
            <HeaderTableCell onClick={() => sort('phone')} sx={{fontSize:'18px'}} align="right">Phone Number</HeaderTableCell>
            <HeaderTableCell onClick={() => sort('email')} sx={{fontSize:'18px'}} align="right">Email</HeaderTableCell>
            <HeaderTableCell onClick={() => sort('address')} sx={{fontSize:'18px'}} align="right">Address</HeaderTableCell>
            <HeaderTableCell sx={{fontSize:'18px'}} align="right">Delete</HeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {
            Object.keys(personInfo).map((row: any, index: number) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">
                  <Avatar src={`http://192.168.104.228:8000/${personInfo[row].avatar}`}/>
                </TableCell>
                <TableCell sx={{fontSize:'Inter !important'}} align="right">{personInfo[row].name}</TableCell>
                <TableCell align="right">{personInfo[row].birthday}</TableCell>
                <TableCell align="right">{personInfo[row].phone}</TableCell>
                <TableCell align="right">{personInfo[row].email}</TableCell>
                <TableCell align="right">{personInfo[row].address}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => rowDelete(personInfo[row].id) } sx={{color:'#fb771a'}}>
                    <DeleteForeverIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
          )).slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
          }
        </TableBody>
      </Table>
      <Stack direction='row' alignItems='center' justifyContent='center' spacing={3}>
          <IconButton onClick={() => arrowLeft()} sx={{color:'#fb771a'}}><KeyboardDoubleArrowLeftIcon/></IconButton>
          <PageLabl type='number' min={1} max={10} value={page} onChange={handlePage} />
          <IconButton onClick={() => arrowRight()} sx={{color:'#fb771a'}}><KeyboardDoubleArrowRightIcon/></IconButton>
      </Stack>
    </TableContainer>
  );
}
