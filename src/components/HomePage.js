import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Tabs, Tab, Typography, Stack, TextField, List, ListItem, ListItemText, ListItemButton, ListItemIcon} from '@mui/material';
import ApiService from '../ApiService';
import CustFormControl from './CustFormControl';

function TabPanel(props) {
	const { children, selectedTab, index, ...other } = props;

	return (
	<div
		role="tabpanel"
		hidden={selectedTab !== index}
		id={`tabpanel-${index}`}
		aria-labelledby={`tab-${index}`}
		{...other}
	>
		{selectedTab === index && (
			<Box sx={{ p: 3 }}>
				{children}
			</Box>
		)}
	</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	selectedTab: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`,
	};
}

const activityTypes = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"];

const apiService = new ApiService();

export default function HomePage({user}) {

	const {name} = user;

	const [activityType, setActivityType] = useState(activityTypes[0]);
	const [participants, setParticipants] = useState(1);

	const userStr = name;

	const d = new Date(),
		dateStr = d.getFullYear()+d.getMonth().toString()+d.getDate().toString();

	let data = JSON.parse(localStorage.getItem(userStr)) || {list:{}, taskOfTheDay: {}};

	const [tasks, setTasks] = useState({data, loading: true});

	const [selectedTab, setSelectedTab] = useState(0);

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const getTask = async (activityType, participants)=>{
		let next = 0,
			activities = {};
		while(next < 100){
			try{
				let res = await apiService.getTask(activityType, participants);
				if(!res || res instanceof Error){
					next = 100;
				} else {
					const {activity} = res;
					if(activity){
						if(!activities[activity]) {
							activities[activity] = {activity};
						} else {
							next = 100;
						}
					} else {
						next = 100;
					}
				}
			} catch(e){
				next = 100;
			}
			next++;
		}

		setTasks((value)=>{
			const {list, taskOfTheDay} = value.data;
			return {data: {list: {...activities,...list}, taskOfTheDay}, loading: false};
		});
	}
	
	const getTaskOfTheDay = async ()=>{
		try{
			const res = await apiService.getTaskOfTheDay();
			if(res && !(res instanceof Error)){
				const {activity} = res;
				if(activity){
					const newItem = {};
					newItem[activity] = {activity};
					setTasks((value)=>{
						const {list} = value.data;
						return {...value, data: {list: {...newItem, ...list}, taskOfTheDay: {activity, date: dateStr}}};
					});
				}
			}
		} catch(e){

		}
	}
	
	useEffect(()=>{
		const {data} = tasks;
		if(data?.taskOfTheDay?.date !== dateStr){
			getTaskOfTheDay();
		}
	}, []);

	useEffect(()=>{
		getTask(activityType, participants);
	}, [activityType, participants]);

	const changeTaskType = ({item, value})=>{
		const {activity} = item;
		const newItem = {};
		newItem[activity] = {activity, type: value};
		setTasks(prev=>{
			const {data} = prev;
			const {list} = data;
			return {...prev, data:{...data, list: {...list, ...newItem}}};
		})
	};

	data = tasks.data || {};
	const {list} = data;
	const listArr = list ? Object.values(list) : [];

	list && Object.values(list).length && localStorage.setItem(userStr, JSON.stringify(data));

	const resList = (list, selectable)=>{
		return (<List>
			{list.map(item=>(<ListItem key={item?.activity} divider={true} >
					<ListItemButton>
						{selectable ? <ListItemIcon>
							<CustFormControl label={item?.activity} selected={item?.type} list={['','Wish List','Completed']} 
								handleChange={(value)=>{changeTaskType({item, value})}} noLabel={true} />
						</ListItemIcon> : null}
						<ListItemText primary={item?.activity} />
					</ListItemButton>
				</ListItem>))}
		</List>);
	};

	const tabs = tasks.loading ? <Typography>Loading...</Typography> : <React.Fragment>
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs value={selectedTab} onChange={handleChange} aria-label="tabs">
				<Tab label="Unselected" {...a11yProps(0)} />
				<Tab label="Wish List" {...a11yProps(1)} />
				<Tab label="Complited Tasks" {...a11yProps(2)} />
				<Tab label="Task of the day" {...a11yProps(3)} />
			</Tabs>
		</Box>
		<TabPanel selectedTab={selectedTab} index={0}>
			{resList(listArr.filter(task=>(!task.type)), true)}
		</TabPanel>
		<TabPanel selectedTab={selectedTab} index={1}>
			{resList(listArr.filter(task=>(task.type==='Wish List')), true)}
		</TabPanel>
		<TabPanel selectedTab={selectedTab} index={2}>
			{resList(listArr.filter(task=>(task.type==='Completed')))}
		</TabPanel>
		<TabPanel selectedTab={selectedTab} index={3}>
			{resList(tasks?.data?.taskOfTheDay ? [tasks.data.taskOfTheDay] : [])}
		</TabPanel>
	</React.Fragment>;

	return (
	<Box sx={{ width: '100%' }}>
		<Stack direction="row" spacing={2}>
			<CustFormControl label="Activity Type" selected={activityType} list={activityTypes} handleChange={setActivityType}/>
			<TextField id='participants' label='Participants' type='number' inputProps={{min:1}} defaultValue={1}
				onChange={({target: {value}})=>{setParticipants(value)}} autoFocus />
		</Stack>
		{tabs}
	</Box>);
}
