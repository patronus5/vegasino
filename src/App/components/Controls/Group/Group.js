import React, { forwardRef } from 'react';

function Group (props, ref)
{
	const cn = "Group " + (props.className || "")

	const p = {};
	for(let i = 0, k = Object.keys(props); i < k.length; i++)
	{
		const key = k[i];
		const val = props[key];

		if (key !== 'className' && key !== 'children')
		{
			p[key] = val;
		}
	}

	return (
		<div
			ref={ref}
			className={cn}
			{...p}>
			{props.children}
		</div>
	);
}

export default forwardRef(Group);