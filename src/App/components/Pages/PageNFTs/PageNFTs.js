import React from 'react';
import { withRouter } from "react-router";
import PropTypes from "prop-types";

//components
import { Text, Group, Panel,  Image, Link } from '../../Controls'

//css
import './PageNFTs.css'

class PageNFTs extends React.Component
{
	static propTypes = {
		location: PropTypes.object.isRequired,
	};

	constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			updateRevision: 0,
		}

		this.updatePage = this.updatePage.bind(this);
	}

	componentDidMount()
	{	
		this.updatePage()
		document.addEventListener('chef_dataLoaded', this.updatePage);
		document.addEventListener('app_reload', this.updatePage);      
		document.addEventListener('nft_userInfo', this.updatePage);      
		document.addEventListener('nft_loadNFT', this.updatePage); 
		document.addEventListener('nft_loadUserNFT', this.updatePage); 
	}

	componentWillUnmount()
	{	
		document.removeEventListener('chef_dataLoaded', this.updatePage);
		document.removeEventListener('app_reload', this.updatePage);    
		document.removeEventListener('nft_userInfo', this.updatePage);      
		document.removeEventListener('nft_loadNFT', this.updatePage);    
		document.removeEventListener('nft_loadUserNFT', this.updatePage);    
	}

	updatePage()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

	renderGallery()
	{
		let list = [];
		window.chef.nft.nfts.forEach(nft =>
		{
			list.push(nft);
		})
		return (
			<Group>
				<Text className="header" size="2">
					NFT Gallery
					<br />
				</Text>
				{this.renderNFTList(list)}
			</Group>
		);
	}

	renderUserGallery()
	{
		let list = [];
		window.chef.nft.nfts.forEach(nft =>
		{
			if (window.chef.nft.userNFTs.includes(nft.id))
			{
				list.push(nft);
			}
		})
		return (
			<Group>
				<Text className="header" size="2">
					Your NFTs
					<br />
				</Text>
				{this.renderNFTList(list)}
			</Group>
		);
	}

	renderNFTList(_list)
	{
		const nfts = _list.map(nft =>
		{
			nft.load = true;
			if (nft.json === null)
			{
				return null;
			}
			return (
				<Link key={nft.id} nav={true} href={`nfts?id=${nft.id}`}>
					<Image src={nft.json.image} />
				</Link>
			);
		})

		return (
			<Group className="nftList">
				{nfts}
			</Group>
		);
	}

	renderCantFind(_id)
	{
		return (
			<Text>
				Can't find NFT with ID {_id}!
			</Text>
		);
	}

	renderLoading()
	{
		return (
			<Text>
				Please wait...
			</Text>
		);		
	}

	renderNFT(_id)
	{
		const nft = window.chef.nft.findNFT(_id);
		if (nft === null)
		{
			return this.renderCantFind();
		}
		else if (nft.json === null)
		{
			nft.load = true;
			return this.renderLoading();
		}
		const attributes = nft.json.attributes.map(a =>
		{
			return (
				<Group key={a.trait_type} className="attributeGroup">
					<Text className="name">
						{a.trait_type}
					</Text>
					<Text className="value">
						{a.value}
					</Text>
				</Group>				
			);			
		});

		return (
			<Panel className="Panel_singleNFT">
				<Text className="header" size="2">
					NFT #{nft.id}
				</Text>
				<Image className="singleNFT" src={nft.json.image} />
				<Group className="attributes">
					{attributes}
				</Group>
			</Panel>
		);
	}

	renderWrongChain()
	{

	}

    render()
    {
		if (window.chef.nft === null)
		{
			return (
				<Group className="PageNFTs">
					<Panel className="Panel_Info">
						Either you are connected to the wrong chain
						<br />
						or your selected RPC node has some connection problems.
					</Panel>
				</Group>
			);
		}

		const { location } = this.props;
		const searchParams = new URLSearchParams(location.search);
		const nftID = (!searchParams.has('id') ? null : searchParams.get('id'));
		const mode = (!searchParams.has('mode') ? null : searchParams.get('mode'));
        return (
			<Group className="PageNFTs">
				{nftID !== null
					? this.renderNFT(nftID)
					: (mode === "gallery"
						? this.renderGallery()
						: this.renderUserGallery())
				}
			</Group>
		)
    }
}

export default withRouter(PageNFTs);