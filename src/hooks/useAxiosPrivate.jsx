import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				// console.log(`Axios Private Config: ${JSON.stringify(config)}`);
				if (!config.headers['Authorization']) {
					// First attempt -- Add authorization header
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(error) => {
				Promise.reject(error);
			}
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				// console.log(`Previous Request:\n${JSON.stringify(prevRequest)}`);
				// 403 when token is expired and if prevRequest.send is false
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					// console.log("Requesting New Access Token");
					const newAccessToken = await refresh();
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
};

export default useAxiosPrivate;
