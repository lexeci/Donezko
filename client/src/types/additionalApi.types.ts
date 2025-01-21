/**
 * Type representing the structure of the weather data response.
 * Contains location details and current weather information including temperature, conditions, wind, and visibility.
 */
export type WeatherResponse = {
    location: {
        name: string; // Name of the location (e.g., city)
        country: string; // Country of the location
        region: string; // Region of the location (e.g., state or province)
    };
    current: {
        temp_c: number; // Current temperature in Celsius
        condition: {
            text: string; // Description of the current weather condition (e.g., "Sunny", "Rainy")
        };
        wind_kph: number; // Wind speed in kilometers per hour
        humidity: number; // Humidity percentage
        feelslike_c: number; // Temperature as perceived by humans, in Celsius
        windchill_c: number; // Wind chill temperature in Celsius
        gust_kph: number; // Wind gust speed in kilometers per hour
        uv: number; // UV index (level of ultraviolet radiation)
        vis_km: number; // Visibility distance in kilometers
    };
};

/**
 * Type representing the structure of the advice response for slips.
 * Contains an ID and a piece of advice related to safety or risk of slipping.
 */
export type AdviceResponse = {
    slip: {
        id: number; // Unique identifier for the slip advice
        advice: string; // The actual advice related to avoiding slips
    };
};

/**
 * Type representing the structure of the news response related to Elon Musk.
 * Includes source, title, description, and the image URL for the news article.
 */
export type ElonNewsResponse = {
    source: string; // The source of the news (e.g., news outlet)
    title: string; // Title of the news article
    description: string; // Brief description of the article
    use: string; // Information about the usage or relevance of the news
    urlImage: string; // URL to an image associated with the news article
    publishDate: string; // The publication date of the article
};
