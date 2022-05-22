import React from 'react';
import ReactModal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';

//components
import AppChef from './AppChef';

//init
ReactModal.setAppElement('#root')

class App extends React.Component
{
	render()
	{
		return (
			<>
				<BrowserRouter>
					<AppChef />
				</BrowserRouter>
			</>
		)
	}
}

export default App;