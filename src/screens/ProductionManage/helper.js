export const fetchDataForManageStatus = async (status, limit, offset, userData ,searchtext,type) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    // Construct the API URL with the provided parameters
    let apiUrl = `https://gsidev.ordosolution.com/api/production_pickup_del/?limit=${limit}&offset=${offset}&search_name=${searchtext}&user=${userData?.id}&status=${status}&transportation_type=${type}`;
    console.log("url--------------------->", apiUrl)

    try {
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error(`Error fetching sales orders for status ${status}:`, error);
        return [];
    }
};