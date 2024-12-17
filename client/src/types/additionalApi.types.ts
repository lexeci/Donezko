export type WeatherResponse = {
	location: {
		name: string;
		country: string;
		region: string;
	};
	current: {
		temp_c: number;
		condition: {
			text: string;
		};
		wind_kph: number;
		humidity: number;
		feelslike_c: number;
		windchill_c: number;
		gust_kph: number;
		uv: number;
		vis_km: number;
	};
};

export type AdviceResponse = {
	slip: {
		id: number;
		advice: string;
	};
};

export type ElonNewsResponse = {
	source: string;
	title: string;
	description: string;
	use: string;
	urlImage: string;
	publishDate: string;
};
