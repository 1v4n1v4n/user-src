import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
	SEARCH_USERS,
	SET_LOADING,
	CLEAR_USERS,
	GET_USER,
	GET_REPOS,
	GET_ADMIN_USER,
	GET_ADMIN_REPOS,
} from '../types';

let githubClientId;
let githubClientSecret;

// HTTP requests
if (process.env.NODE_ENV !== 'production') {
	githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
	githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
	githubClientId = process.env.GITHUB_CLIENT_ID;
	githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		admin_user: {},
	};

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	// Search Users
	const searchUsers = async text => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=
			${githubClientSecret}`
		);
		dispatch({
			type: SEARCH_USERS,
			payload: res.data.items,
		});
	};

	// Get User
	const getUser = async username => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_USER,
			payload: res.data,
		});
	};

	// Get Admin User
	const getAdminUser = async () => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/users/1v4n1v4n?client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_ADMIN_USER,
			payload: res.data,
		});
	};

	// Get Repos
	const getUserRepos = async username => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	};

	// Get Admin Repos
	const getAdminRepos = async () => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/users/1v4n1v4n/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_ADMIN_REPOS,
			payload: res.data,
		});
	};

	// Clear Users
	const clearUsers = () => dispatch({ type: CLEAR_USERS });
	// Set Loading
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				searchUsers,
				clearUsers,
				getUser,
				getUserRepos,
				getAdminUser,
				getAdminRepos,
			}}
		>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
