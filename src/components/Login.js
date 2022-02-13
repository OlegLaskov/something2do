import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Button} from '@mui/material';

export default function Login(props) {
	const { onLogin, open, ...other } = props;

	const [name, setName] = useState('');

	const handleLogin = ()=>{
		onLogin({name});
	}

	return (
		<Dialog 
			open={open}
			{...other} 
		>
			<DialogTitle>Login</DialogTitle>
			<DialogContent>
				<Stack spacing={2}>
					<TextField id='name' label='Name' onChange={({target: {value}})=>{setName(value)}} 
						style={{marginTop: '5px'}} autoFocus />
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleLogin} disabled={!(Boolean(name))} >Login</Button>
			</DialogActions>
		</Dialog>
	);
}
