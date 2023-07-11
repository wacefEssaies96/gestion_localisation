export const deleteData = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE'
    })
    const data = await response.json()
    return data
}

export const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
}