import React from 'react';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

export default function CustFormControl({label, selected, list, handleChange, noLabel}){
	const id = label ? label.toString().replace(/[^a-zA-z0-9_-]/gm, '') : 'id1',
		labelId = id+'label';
	return <FormControl variant="standard" >
		{noLabel ? null : <InputLabel id={labelId}>{label}</InputLabel>}
		<Select
			labelId={labelId}
			id={id}
			value={selected || ''}
			onChange={({target: value})=>{handleChange(value.value)}}
		>
			{list.map((option) => (
				<MenuItem 
					value={option}
					key={option}
				>{option || 'Unselected'}</MenuItem>
			))}
		</Select>
	</FormControl>;
}