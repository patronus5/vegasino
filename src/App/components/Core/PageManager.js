import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'

//components
import { PageHome, PageFarms, PagePool, PageBuy, PageNFTs, PagePresale, PageVegas, PageStakingPool } from '../Pages'

class PageManager extends React.Component
{
	static pages =
	[
		{
			id: "home",
			label: "Home"
		},
		{
			id: "vegas",
			label: "Vegas"
		},
		{
			id: "sale",
			label: "NFT Sale"
		},
		{
			id: "nfts",
			label: "NFTs"
		},
		{
			id: "pool",
			label: "Pool"
		},
		// {
		// 	id: 'old',
		// 	label: 'Old'
		// }
	]

	componentDidUpdate(prevProps)
	{
		if (prevProps.location.pathname !== this.props.location.pathname) 
		{
			this.props?.routeChanged(this.props.location.pathname);
		}
	}

    render()
    {
		return (
			<Switch>
				<Route path="/" exact>
					<PageHome />
				</Route>
				<Route path="/home" exact>
					<PageHome />
				</Route>
				<Route exact path="/buy">
					<PageBuy />
				</Route>
				<Route exact path="/pool">
					<PageStakingPool />
				</Route>
				<Route path="/sale" exact>
					<PagePresale />
				</Route>
				<Route path="/nfts">
					<PageNFTs />
				</Route>
				<Route path="/vegas">
					<PageVegas />
				</Route>			
				{/* <Route path='/old'>
					<PagePool />
				</Route>	 */}
			</Switch>
		)
    }
}

export default withRouter(PageManager);