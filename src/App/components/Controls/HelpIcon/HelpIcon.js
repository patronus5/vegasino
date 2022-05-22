import React, { useState } from 'react';
import { usePopper } from 'react-popper';

//libs
import {LSymbols} from '../../../libs'

//components
import { Group } from '../'

//css
import './HelpIcon.css'

function HelpIcon({ className, placement, mobilePlacement, children })
{
	const mobile = window.innerWidth < 600;

	const defaultState_Visible = () => {
		return false;
	};

	let myPlacement = (placement ?? 'right');
	if (mobile)
	{
		myPlacement = (mobilePlacement ?? myPlacement);
	}

	const [visible, setVisible] = useState(defaultState_Visible);
	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const [arrowElement, setArrowElement] = useState(null);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 12] } }
		],
		placement: myPlacement
	});

	const classes = ['HelpIcon'];
	if (className)
	{
		classes.push(className);
	}

	return (
		<Group
			className={classes.join(' ')}
			onMouseEnter={() => !mobile && setVisible(true)}
			onMouseLeave={() => !mobile && setVisible(false)}
			onClick={() => mobile && setVisible(!visible)}
		>
			{LSymbols.question("svgLink", null, null, setReferenceElement)}
			{
				visible &&
				<Group ref={setPopperElement} className="popper" role="tooltip" style={styles.popper} {...attributes.popper}>
					{children}
					<Group className="arrow" ref={setArrowElement} style={styles.arrow} data-popper-arrow />
				</Group>
			}
		</Group>
	);
};

export default HelpIcon;