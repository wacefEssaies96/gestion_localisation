import { useLocation } from "react-router";

export default function useQueryParams() {
    const search = useLocation().search;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params
}