import React, {useState} from 'react';
import './App.css';
import {CssBaseline, Container, Typography} from '@mui/material';
import Login from './components/Login';
import HomePage from './components/HomePage';

export default function App() {

	const [user, setUser] = useState(JSON.parse(localStorage.getItem('somthing2doUser') || null));

	const onLogin = (user)=>{
		setUser(user);
		localStorage.setItem('somthing2doUser', JSON.stringify(user));
	}

	const homePage = user ? <HomePage user={user} /> : null;
	
	return (
		<div className="App">
			<CssBaseline />
			<Container maxWidth="sm">
				<Typography variant="h3" gutterBottom component="div" className='header'>Something To Do</Typography>
				<Login open={!Boolean(user)} onLogin={onLogin} />
				{homePage}
			</Container>
		</div>
	);
}
