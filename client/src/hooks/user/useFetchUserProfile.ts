import {ProfileResponse, userService} from "@/services/user.service";
import {useQuery} from "@tanstack/react-query";
import {useState, useEffect} from "react";
import {useCookieMonitor} from "../useCookieMonitor";
import {AuthUser} from "@/types/auth.types";

/**
 * Custom hook to fetch the user profile based on the existence of an access token cookie.
 * It listens for changes to the "accessToken" cookie and triggers the query when the cookie exists.
 *
 * @returns An object containing:
 *   - profileData: The fetched user profile data.
 *   - isDataLoading: Boolean indicating if the data is still loading.
 *   - isDataLoaded: Boolean indicating if the data has been successfully fetched.
 *   - refetch: A function to refetch the profile data.
 */
export function useFetchUserProfile() {
    const [cookiesExist, setCookiesExist] = useState(false);
    const [profileData, setProfileData] = useState<ProfileResponse | undefined>(
        undefined
    );

    // Callback to set cookiesExist to true when the "accessToken" cookie appears
    const handleCookieChange = () => {
        setCookiesExist(true);
    };

    // Callback to set cookiesExist to false when the "accessToken" cookie disappears
    const handleCookieRemove = () => {
        setCookiesExist(false);
    };

    // Monitor the "accessToken" cookie for changes and trigger the appropriate callback
    useCookieMonitor("accessToken", handleCookieChange, handleCookieRemove);

    // Use React Query's `useQuery` to fetch the profile data only when the cookie exists
    const {
        data,
        isLoading: isDataLoading,
        isSuccess: isDataLoaded,
        refetch, // Method to manually refetch the data
    } = useQuery({
        queryKey: ["profile"], // The query key for caching the profile data
        queryFn: () => userService.getProfile(), // Function to fetch the profile data
        enabled: cookiesExist, // The query will only run if the "accessToken" cookie exists
        retry: false, // Disable automatic retries if the cookie does not exist
    });

    useEffect(() => {
        if (isDataLoaded && data) {
            setProfileData(data);
        }
    }, [data, isDataLoaded]);


    // Return the profile data, loading state, success state, and the refetch method
    return {profileData, isDataLoading, isDataLoaded, refetch};
}
